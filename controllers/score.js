const Score = require('../models/Score');

exports.getScores = async (req, res, next) => {
    try {
        const score = await Score.find();
        res.status(200).json({ success: true, count: score.length, data: score });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getScore = async (req, res, next) => {
    try {
        const score = await Score.findById(req.params.id);

        if (!score) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: score });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getScoreByUserID = async (req,res,next) => {
    try {
        const score = await Score.find({user:req.params.UserID});
        if(!score) return res.status(400).json({ success: false })
        res.status(200).json({ success:true, data: score });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.createScore  = async (req, res, next) => {
    try {
        const score = await Score.create(req.body);
        res.status(201).json({ success: true, data: score });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.updateScore = async (req, res, next) => {
    try {
        const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!score) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: score });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};

exports.deleteScore = async (req, res, next) => {
    try {
        const score = await Score.findByIdAndDelete(req.params.id);

        if (!score) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};