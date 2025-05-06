const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');
const Category = require('../models/Category');

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

exports.getQuizzesByFilter = async (req, res) => {
    const filter = {};
    if (req.params.subjectID) filter.subject = req.params.subjectID;
    if (req.params.categoryID) filter.category = req.params.categoryID;
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';

    try {
        const quizzes = await Quiz.find(filter);
        if (quizzes.length === 0) {
            return res.status(404).json({ success: false, message: "No quizzes found with specified filter" });
        }
        res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
    }
};

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
        if(req.user.role !== 'S-admin'){
            req.body.approved = false;
        }
        const subject = Subject.find(req.body.subject);
        const category = Category.find(req.body.category);
        if(!subject)
            return res.status(404).json({success: false, message: "there is no this subject"});
        if(!category)
            return res.status(404).json({success: false, message: "there is no this category"});
        
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

        const isAdmin = req.user.role === "admin";
        const isSAdmin = req.user.role === "S-admin";

        if (!isAdmin && !isSAdmin) {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this Quiz`,
            });
        }

        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });

    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
