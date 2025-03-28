const express = require('express');
const { getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop } = require('../controllers/massage-shops');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const reservationRouter = require('./reservations');
router.use('/:massageShopId/reservations', reservationRouter);

router.route('/')
    .get(getMassageShops)
    .post(protect, authorize('admin'), createMassageShop);
router.route('/:id')
    .get(getMassageShop)
    .put(protect, authorize('admin'), updateMassageShop)
    .delete(protect, authorize('admin'), deleteMassageShop);

module.exports = router;