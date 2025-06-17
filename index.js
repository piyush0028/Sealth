const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const { ClerkExpressRequireAuth, verifyToken } = require('@clerk/clerk-sdk-node');
const WebSocket = require('ws');
const http = require('http');

// Existing enrollment app setup
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API working!');
});

app.use('/enrollments', ClerkExpressRequireAuth());
app.get('/enrollments', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE clerk_user_id = $1',
      [clerkUserId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = req.auth.userId;
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE enrollment_id = $1 AND clerk_user_id = $2',
      [id, clerkUserId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/enrollments', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { 
      name, age, gender, date_of_joining, due_date, total_installment,
      pending, phone_no, email_id, role, weight, workout_partner_preference,
      type_of_workout, current_prs, goals, favorite_flavour, workout_frequency, dietary_preference
    } = req.body;

    const result = await pool.query(
      `INSERT INTO enrollments (
        clerk_user_id, name, age, gender, date_of_joining, due_date, 
        total_installment, pending, phone_no, email_id, role, weight, 
        workout_partner_preference, type_of_workout, current_prs, goals, 
        favorite_flavour, workout_frequency, dietary_preference
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *`,
      [
        clerkUserId, name, age, gender, date_of_joining, due_date, 
        total_installment, pending, phone_no, email_id, role, weight, 
        workout_partner_preference, type_of_workout, current_prs, goals, 
        favorite_flavour, workout_frequency, dietary_preference
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create HTTP server for WebSocket integration
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected users: { clerkUserId: WebSocket }
const connectedUsers = new Map();

// Database setup for messages (run this SQL once)
/*
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);
CREATE INDEX idx_sender ON messages(sender_id);
CREATE INDEX idx_receiver ON messages(receiver_id);
*/

wss.on('connection', (ws, req) => {
  // Extract token from query parameters
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
  
  if (!token) {
    ws.close(1008, 'Authentication token missing');
    return;
  }
  verifyToken(token)
    .then(decoded => {
      const userId = decoded.sub;
      console.log(`Authenticated user: ${userId}`);
      
      connectedUsers.set(userId, ws);
      
      sendPendingMessages(userId);
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          await handleMessage(userId, message);
        } catch (err) {
          console.error('Error handling message:', err);
        }
      });

      ws.on('close', () => {
        connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
      });
    })
    .catch(err => {
      console.error('WebSocket auth failed:', err);
      ws.close(1008, 'Authentication failed');
    });
});

async function handleMessage(senderId, message) {
  const { receiverId, content } = message;
  
  if (!receiverId || !content || content.trim() === '') {
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING id, created_at`,
      [senderId, receiverId, content.trim()]
    );
    
    const savedMessage = result.rows[0];
    
    const messageObj = {
      id: savedMessage.id,
      senderId,
      receiverId,
      content: content.trim(),
      createdAt: savedMessage.created_at,
      isRead: false
    };
    
    if (connectedUsers.has(receiverId)) {
      const receiverWs = connectedUsers.get(receiverId);
      receiverWs.send(JSON.stringify({
        type: 'message',
        ...messageObj
      }));
    }
    
    if (connectedUsers.has(senderId)) {
      const senderWs = connectedUsers.get(senderId);
      senderWs.send(JSON.stringify({
        type: 'delivery-confirmation',
        messageId: savedMessage.id,
        timestamp: new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error('Error saving message:', err);
  }
}

async function sendPendingMessages(userId) {
  try {
    const result = await pool.query(
      `UPDATE messages
       SET is_read = true
       WHERE receiver_id = $1 AND is_read = false
       RETURNING id, sender_id, content, created_at`,
      [userId]
    );
    if (result.rows.length > 0 && connectedUsers.has(userId)) {
      const ws = connectedUsers.get(userId);
      ws.send(JSON.stringify({
        type: 'pending-messages',
        messages: result.rows.map(row => ({
          id: row.id,
          senderId: row.sender_id,
          content: row.content,
          createdAt: row.created_at,
          wasPending: true
        }))
      }));
    }
  } catch (err) {
    console.error('Error fetching pending messages:', err);
  }
}
app.get('/chat/history/:otherUserId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const otherUserId = req.params.otherUserId;
    
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId, otherUserId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/chat/mark-read', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { messageIds } = req.body;
    
    await pool.query(
      `UPDATE messages
       SET is_read = true
       WHERE id = ANY($1) AND receiver_id = $2`,
      [messageIds, userId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port ${PORT}`);
});