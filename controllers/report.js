const Report = require('../models/Report');

exports.getReports = async (req, res, next) => {
    try {
        const report = await Report.find();
        res.status(200).json({ success: true, count: report.length, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getReportByUserID = async (req,res,next) => {
    try {
        const report = await Report.find({user:req.params.UserID});
        if(!report) return res.status(400).json({ success: false })
        res.status(200).json({ success:true, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getReportByQuizID = async (req,res,next) => {
    try {
        const report = await Report.find({user:req.params.quizID});
        if(!report) return res.status(400).json({ success: false })
        res.status(200).json({ success:true, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.createReport  = async (req, res, next) => {
    try {
        const report = await Report.create(req.body);
        res.status(201).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.updateReport = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!report) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};

exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);

        if (!report) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};