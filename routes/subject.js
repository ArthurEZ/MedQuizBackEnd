const express = require('express');
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subject');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Route for getting all subjects
router.route('/')
    .get(getSubjects) // GET all subjects
    .post(protect, authorize('S-admin'), createSubject); // POST create new subject (only for S-admin)

// Route for getting, updating, and deleting a specific subject by ID
router.route('/:id')
    .get(getSubject) // GET subject by ID
    .put(protect, authorize('S-admin'), updateSubject) // PUT update subject by ID (only for S-admin)
    .delete(protect, authorize('S-admin'), deleteSubject); // DELETE subject by ID (only for S-admin)

module.exports = router;
