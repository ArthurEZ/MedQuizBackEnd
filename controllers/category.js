const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
    try {
        const category = await Category.find();
        res.status(200).json({ success: true, count: category.length, data: category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!category) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};