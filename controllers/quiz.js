const Quiz = require('../models/Quiz')

exports.getQuizzes = async (req, res, next) => {
    try {
        const quiz = await Quiz.find();
        res.status(200).json({ success: true, count: quiz.length, data: quiz });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.getQuizzesByCategory = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ category: req.params.categoryID }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no this category"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false });
        }

        res.status(200).json({ success: true, data: quiz });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.createQuiz = async (req, res, next) => {
    try {
        if(req.user.role == 'S-admin'){
            req.body.isApproved = true;
            req.body.proved = 2;
        }
        else if(req.user.role == 'admin'){
            req.body.isApproved = false;
            req.body.proved = 1;
        }
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "No quiz with this ID" });
        }

        const isOwner = quiz.user.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";
        const isSAdmin = req.user.role === "S-admin";

        if (!isOwner && !isAdmin && !isSAdmin) {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this Quiz`,
            });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: updatedQuiz });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};


exports.approveQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) return res.status(404).json({ success: false });
        if(req.user.role === "user") {
            return res.status(400).json({success: false, message: "you dont have permission"});
        }

        if (req.user.role === "S-admin") {
            quiz.proved = 2;
        } else if (req.user.role === "admin") {
            quiz.proved += 1;
        }
        if(quiz.proved === 2) {
            quiz.isApproved = true;
        }
        await quiz.save();
        res.status(200).json({ success: true, data: quiz });

    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
}

exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ success: false });
        }

        const isOwner = quiz.user.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";
        const isSAdmin = req.user.role === "S-admin";

        if (!isOwner && !isAdmin && !isSAdmin) {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this Quiz`,
            });
        }

        if (req.user.role === 'S-admin' || req.user.role === 'user'){
            quiz.pendingDelete = 2;
        }
        else if (req.user.role === 'admin') {
            quiz.pendingDelete = (quiz.pendingDelete || 0) + 1;
        }

        if(quiz.pendingDelete === 2) {
            await quiz.remove();
            return res.status(200).json({ success: true, data: {} });
        }

        await quiz.save();
        res.status(200).json({ success: true, data: quiz.pendingDelete });

    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
