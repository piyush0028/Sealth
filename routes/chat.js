const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('../middlewares/auth');
const {
  getChatHistory,
  markMessagesRead
} = require('../controllers/chatController');

router.use(ClerkExpressRequireAuth());

router.get('/history/:otherUserId', getChatHistory);
router.post('/mark-read', markMessagesRead);

module.exports = router;
