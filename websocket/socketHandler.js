const WebSocket = require('ws');
const { verifyToken } = require('../middlewares/auth');
const pool = require('../config/db');

const connectedUsers = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');

    if (!token) return ws.close(1008, 'Authentication token missing');

    verifyToken(token)
      .then(decoded => {
        const userId = decoded.sub;
        connectedUsers.set(userId, ws);
        sendPendingMessages(userId);

        ws.on('message', async (data) => {
          try {
            const msg = JSON.parse(data);
            await handleMessage(userId, msg);
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
}

async function handleMessage(senderId, message) {
  const { receiverId, content } = message;
  if (!receiverId || !content?.trim()) return;

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING id, created_at`,
      [senderId, receiverId, content.trim()]
    );
    const saved = result.rows[0];

    const msgObj = {
      id: saved.id,
      senderId,
      receiverId,
      content: content.trim(),
      createdAt: saved.created_at,
      isRead: false
    };

    if (connectedUsers.has(receiverId)) {
      connectedUsers.get(receiverId).send(JSON.stringify({ type: 'message', ...msgObj }));
    }

    if (connectedUsers.has(senderId)) {
      connectedUsers.get(senderId).send(JSON.stringify({
        type: 'delivery-confirmation',
        messageId: saved.id,
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
    if (result.rows.length && connectedUsers.has(userId)) {
      connectedUsers.get(userId).send(JSON.stringify({
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

module.exports = { setupWebSocket };
