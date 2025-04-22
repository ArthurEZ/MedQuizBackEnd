const Quiz = require('../models/Quiz')

exports.getQuizzes = async (req, res, next) => {
    try {
        const quiz = await Quiz.find();
        res.status(200).json({ success: true, count: quiz.length, data: quiz });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.getQuizzesByCategory = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ category: req.params.category }); 
        if(quizzes.length <= 0) res.status(500).json({ success: false, message: "there is no this category"})
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
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: quiz });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.createQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.create(req.body);
        if(req.user.role == 'S-admin'){
            req.body.proved = true;
        }
        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
}

exports.updateQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!quiz) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};

exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
    }
};