const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});