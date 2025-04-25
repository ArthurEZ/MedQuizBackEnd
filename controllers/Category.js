const Category = require('../models/Category')

exports.getCategories = async (req, res, next) => {
    try {
        const category = await Category.find();
        if(category.length <= 0) return res.status(404).json({ success: false, message: "there is no category"});
        res.status(200).json({ success: true, count: category.length, data: category });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.getCategory= async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "there is no ID of this category" });

        res.status(200).json({ success: true, data: category });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.createCategory = async (req, res, next) => {
    try {
        if(req.user.role !== 'S-admin'){
            res.status(500),json({ success: false, message: "you have no permission to create Category"});
        }

        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        if (req.user.role !== 'S-admin') {
            return res.status(403).json({ success: false, message: "You have no permission to update this category" });
        }

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
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        if (req.user.role !== 'S-admin') {
            return res.status(403).json({ success: false, message: "You have no permission to delete this category" });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};