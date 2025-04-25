const express = require('express');
const { getQuizzes, getQuizzesByCategory, getQuiz, createQuiz, updateQuiz, approveQuiz, deleteQuiz} = require('../controllers/quiz');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getQuizzes)
    .post(protect, createQuiz);

router.get("/cate/:categoryID", getQuizzesByCategory);

router.route('/:id')
    .get(getQuiz)
    .put(protect, updateQuiz)
    .delete(protect, deleteQuiz);

router.put('/:id/approve', protect, authorize('admin', 'S-admin'), approveQuiz);

module.exports = router;