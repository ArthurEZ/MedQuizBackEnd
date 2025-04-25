const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory} = require('../controllers/Category')
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('admin','S-admin'), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('admin','S-admin'), updateCategory)
    .delete(protect, authorize('admin','S-admin'), deleteCategory);

module.exports = router;