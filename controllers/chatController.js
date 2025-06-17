const pool = require('../config/db');

exports.getChatHistory = async (req, res) => {
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
};

exports.markMessagesRead = async (req, res) => {
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
};
