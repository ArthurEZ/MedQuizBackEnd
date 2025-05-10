const express = require('express');
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subject');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all subjects | POST create new subject with image
router.route('/')
  .get(getSubjects)
  .post(
    protect,
    authorize('S-admin'),
    upload.single('image'),      // <-- Add image upload middleware
    createSubject
  );

// GET by ID | PUT update with image | DELETE
router.route('/:id')
  .get(getSubject)
  .put(
    protect,
    authorize('S-admin'),
    upload.single('image'),      // <-- Allow updating image
    updateSubject
  )
  .delete(protect, authorize('S-admin'), deleteSubject);

module.exports = router;
