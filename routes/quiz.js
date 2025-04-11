const express = require('express');
const { getQuizzes, getQuizzesByCategory, getQuiz, createQuiz, updateQuiz, deleteQuiz} = require('../controllers/quiz');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getQuizzes)
    .post(protect, authorize('admin','S-admin'), createQuiz);

router.get("/cate/:categoryId", getQuizzesByCategory);

router.route('/:id')
    .get(getQuiz)
    .put(protect, authorize('admin','S-admin'), updateQuiz)
    .delete(protect, authorize('admin','S-admin'), deleteQuiz);

module.exports = router;