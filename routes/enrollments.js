const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('../middlewares/auth');
const {
  getEnrollments,
  getEnrollmentById,
  createEnrollment
} = require('../controllers/enrollmentController');

router.use(ClerkExpressRequireAuth());

router.get('/', getEnrollments);
router.get('/:id', getEnrollmentById);
router.post('/', createEnrollment);

module.exports = router;
