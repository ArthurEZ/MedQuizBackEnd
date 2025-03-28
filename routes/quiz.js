const express = require('express');
const { getQuizzes, getQuizzesByCategory, getQuiz, createQuiz, updateQuiz, deleteQuiz} = require('../controllers/category');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getQuizzes)
    .post(protect, authorize('admin'), createQuiz);
    
router.route('/:category').get(getQuizzesByCategory);

router.route('/:id')
    .get(getQuiz)
    .put(protect, authorize('admin'), updateQuiz)
    .delete(protect, authorize('admin'), deleteQuiz);

module.exports = router;