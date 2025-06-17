const pool = require('../config/db');

exports.getEnrollments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE clerk_user_id = $1',
      [req.auth.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM enrollments WHERE enrollment_id = $1 AND clerk_user_id = $2',
      [id, req.auth.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enrollment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const fields = req.body;
    const result = await pool.query(
      `INSERT INTO enrollments (
        clerk_user_id, name, age, gender, date_of_joining, due_date, 
        total_installment, pending, phone_no, email_id, role, weight, 
        workout_partner_preference, type_of_workout, current_prs, goals, 
        favorite_flavour, workout_frequency, dietary_preference
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *`,
      [clerkUserId, ...Object.values(fields)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
