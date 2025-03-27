const MassageShop = require('../models/MassageShop')
const Rating = require('../models/Rating');
const mongoose = require('mongoose')
/**
 * @desc Get all ratings
 * @route GET /api/v1/rating
 * @access Public
 */
exports.getRatings = async (req, res, next) => {
    let query;
    if (req.user.role !== 'admin') {
        query = Rating.find({ user: req.user.id }).populate({
            path: 'massageShop',
            select: 'name province tel'
        });
    }
    else {
        if (req.params.massageShopId) {
            console.log(req.params.massageShopId);
            query = Rating.find({ massageShops: req.params.massageShopId }).populate({
                path: "massageShop",
                select: "name province tel"
            });
        }
        else {
            query = Rating.find().populate({
                path: 'massageShop',
                select: 'name province tel'
            });
        }
    }
    try {
        const rating = await query;

        res.status(200).json({ success: true, count: rating.length, data: rating });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Cannot find Rating" });
    }
};

/**
 * @desc Get single rating
 * @route GET /api/v1/rating/:id
 * @access Public
 */
exports.getRating = async (req, res, next) => {
    try {
        const rating = await Rating.findById(req.params.id).populate({
            path: 'massageShop',
            select: 'name description tel'
        });

        if (!rating) {
            return res.status(404).json({ success: false, message: `No rating with the id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: rating });
    }
    catch (err) {
        console.log(err.stack)
        return res.status(500).json({ success: false, message: "Cannot find Reservation" })
    }
};

/**
 * @desc   Add rating massageShop
 * @route  POST /api/v1/massage-shops/:massageShopId/rating
 * @access Private
 */
exports.addRating = async (req, res, next) => {
    try {
        req.body.massageShop = req.params.massageShopId;

        const massageShop = await MassageShop.findById(req.params.massageShopId);

        if (!massageShop) {
            return res.status(404).json({ success: false, message: `No massage shop with the id of ${req.params.massageShopId}` });
        }

        req.body.user = req.user.id;

        const existRating = await Rating.find({ user: req.user.id });

        if (existRating.length >= 1 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already rate` });
        }

        const rating = await Rating.create(req.body);
        res.status(200).json({ success: true, data: rating });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).json({ success: false, message: 'Cannot create Rating' });
    }
};

/**
 * @desc   Update rating massageShop
 * @route  PUT /api/v1/rating/:id
 * @access Private
 */
exports.updateRating = async (req, res, next) => {
    try {
        let rating = await Rating.findById(req.params.id);

        if (!rating) {
            return res.status(404).json({ success: false, message: `No rating with the id of ${req.params.id}` });
        }

        if (rating.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(404).json({ success: false, message: `User ${req.user.id} is not authorized to update this rating` });
        }

        rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: rating });
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: "Cannot update Rating" });
    }
};

/**
 * @desc   Delete rating massageShop
 * @route  DELETE /api/v1/rating/:id
 * @access Private
 */
exports.deleteRating = async (req, res, next) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ success: false, message: `No rating with the id of ${req.params.id}` });
        }

        if (rating.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(404).json({ success: false, message: `User ${req.params.id} is not authorized to delete this bootcamp` });
        }

        await rating.deleteOne();
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: "Cannot delete rating" });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        req.body.massageShop = req.params.massageShopId;

        const massageShop = await MassageShop.findById(req.params.massageShopId);

        const result = await Rating.aggregate([
            { $match: { massageShop: new mongoose.Types.ObjectId(massageShop) } },
            {
                $group: {
                    _id: "$massageShop",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            res.json({
                averageRating: result[0].averageRating.toFixed(2),
                totalRatings: result[0].totalRatings
            });
        } else {
            res.json({ averageRating: 0, totalRatings: 0 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
}