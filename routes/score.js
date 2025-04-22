const express = require('express');
const { getScores, getScore, getScoreByUserID, createScore, updateScore, deleteScore } = require('../controllers/score');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getScores)
    .post(protect, authorize('admin','S-admin'), createScore);
router.route('/user/:UserID')
    .get(protect, getScoreByUserID)
router.route('/:id')
    .get(getScore)
    .put(protect, authorize('admin','S-admin'), updateScore)
    .delete(protect, authorize('admin','S-admin'), deleteScore);

module.exports = router;