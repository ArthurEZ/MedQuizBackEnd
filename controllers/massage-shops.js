const MassageShop = require('../models/MassageShop');

/** 
 * @desc     Get all Massage Shops
 * @route    GET /api/v1/massage-shops
 * @access   Public
*/
exports.getMassageShops = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = MassageShop.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await MassageShop.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const massageShops = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({ success: true, count: massageShops.length, pagination, data: massageShops });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

/** 
 * @desc     Get single Massage Shop
 * @route    GET /api/v1/massage-shops/:id
 * @access   Public
*/
exports.getMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findById(req.params.id);

        if (!massageShop) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: massageShop });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

/** 
 * @desc     Create new Massage Shop
 * @route    POST /api/v1/massage-shops
 * @access   Private
*/
exports.createMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.create(req.body);

        res.status(201).json({ success: true, data: massageShop });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

/** 
 * @desc     Update Massage Shop
 * @route    PUT /api/v1/massage-shops/:id
 * @access   Private
*/
exports.updateMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!massageShop) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: massageShop });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};

/** 
 * @desc     Delete Massage Shop
 * @route    PUT /api/v1/massage-shops/:id
 * @access   Private
*/
exports.deleteMassageShop = async (req, res, next) => {
    try {
        const massageShop = await MassageShop.findByIdAndDelete(req.params.id);

        if (!massageShop) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};