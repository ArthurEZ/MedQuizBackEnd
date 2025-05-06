const express = require('express');
const {
    getApproveds,
    getApproved,
    createApproved,
    updateApproved,
    deleteApproved,
    approvedQuiz
} = require('../controllers/approved');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getApproveds) // Get all approved records
    .post(protect, authorize('admin'), createApproved); // Create a new approval (admin only)

router.route('/:id')
    .get(getApproved) // Get one approved by ID
    .put(protect, authorize('admin'), updateApproved) // Update an approval (admin only)
    .delete(protect, authorize('admin'), deleteApproved); // Delete an approval (admin only)

router.route('/quiz/:quizID')
    .post(protect, authorize('admin', 'S-admin'), approvedQuiz); // Approve a quiz (admin or S-admin)

module.exports = router;
