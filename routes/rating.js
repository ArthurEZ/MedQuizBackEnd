const express = require('express');
const { getRatings, getRating, addRating, updateRating, deleteRating, getAverageRating } = require('../controllers/rating');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getRatings)
    .post(protect, authorize('admin', 'user'), addRating);
router.route('/:id')
    .get(protect, getRating)
    .put(protect, authorize('admin', 'user'), updateRating)
    .delete(protect, authorize('admin', 'user'), deleteRating);

router.route('/:itemId/average')
    .get(protect, authorize('admin', 'user'), getAverageRating);

module.exports = router;