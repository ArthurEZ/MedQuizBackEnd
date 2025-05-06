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

exports.getQuizzesBySubject = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ subject: req.params.subjectID }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz in this subject"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuizzesByCategoryAndApproved = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ subject: req.params.subjectID, approved: true }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz in this subject that approved"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuizzesByCategoryAndNotApproved = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ subject: req.params.subjectID, approved: false }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz in this subject that not approved"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuizzesByCategory = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ category: req.params.categoryID }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz in this category"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuizzesByCategoryAndApproved = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ category: req.params.categoryID, approved: true }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz in this category that approved"})
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
}

exports.getQuizzesByCategoryAndNotApproved = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ category: req.params.categoryID, approved: false }); 
        if(quizzes.length <= 0) res.status(404).json({ success: false, message: "there is no quiz this category that not approved"})
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
            req.body.approved = true;
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

        const isSAdmin = req.user.role === "S-admin";
        if (!isSAdmin) {
            req.body.approved = false;
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

exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ success: false });
        }
        
        const isAdmin = req.user.role === "admin";
        const isSAdmin = req.user.role === "S-admin";

        if (!isAdmin && !isSAdmin) {
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
