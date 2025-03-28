const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('admin'), createCategory);
router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('admin'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;