const Quiz = require('../models/Quiz')

exports.getQuizzes = async (req, res, next) => {
    
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