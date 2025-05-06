const express = require('express');
const {
    getQuizzes,
    getQuizzesByFilter,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quiz');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 🧪 General filtered quiz fetch (e.g. ?subjectID=123&categoryID=abc&approved=true)
router.get('/filter/:subjectID?/:categoryID?', getQuizzesByFilter);

// 🔍 Get all quizzes (unfiltered)
router.get('/', getQuizzes);

// ➕ Create quiz (protected)
router.post('/', protect, createQuiz);

// 📄 Single quiz operations (get/update/delete)
router
    .route('/:id')
    .get(getQuiz)
    .put(protect, updateQuiz)
    .delete(protect, authorize("S-admin", "admin"), deleteQuiz);



module.exports = router;
