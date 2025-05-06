const mongoose = require('mongoose');
const Approved = require('../models/Approved');
const Quiz = require('../models/Quiz');

exports.getApproveds = async (req, res, next) => {
    try {
        const approved = await Approved.find();
        if(approved.length <= 0) return res.status(404).json({ success: false, message: "there is no approved"});
        res.status(200).json({ success: true, count: approved.length, data: approved });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.getApproved= async (req, res, next) => {
    try {
        const approved = await Approved.findById(req.params.id);
        if (!approved) return res.status(404).json({ success: false, message: "there is no ID of this approved" });

        res.status(200).json({ success: true, data: approved });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.createApproved = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin' || req.user.role !== 'S-admin'){
            return res.status(403).json({ success: false, message: "You have no permission to create approved" });
        }

        const approved = await Approved.create(req.body);
        res.status(201).json({ success: true, data: approved });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.updateApproved = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You have no permission to update" });
        }

        const approved = await Approved.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!approved) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: approved });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteApproved= async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You have no permission to delete" });
        }

        const approved = await Approved.findByIdAndDelete(req.params.id);

        if (!approved) {
            return res.status(400).json({ success: false, message: "there is no approved to delete"});
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.approvedQuiz = async (req, res) => {
    try {
      // Check if the user has permission to approve the quiz
      if (req.user.role !== 'admin' && req.user.role !== 'S-admin') {
        return res.status(403).json({ success: false, message: "You have no permission to approve quiz" });
      }
  
      const quizID = req.params.quizID;
  
      // Validate quiz ID
      if (!mongoose.Types.ObjectId.isValid(quizID)) {
        return res.status(400).json({ success: false, message: "Invalid quiz ID" });
      }
  
      const quiz = await Quiz.findById(quizID);
      if (!quiz) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }
  
      // If the user is S-admin, approve the quiz directly without the need for other approvals
      if (req.user.role === 'S-admin') {
        await Quiz.findByIdAndUpdate(quizID, { approved: true });
        const updatedQuiz = await Quiz.findById(quizID);
        return res.status(200).json({
          success: true,
          message: "Quiz approved by S-admin",
          data: updatedQuiz
        });
      }
  
      // If the user is admin, handle the approval process with multiple admins
      await Approved.findOneAndUpdate(
        { admin: req.user.id, quiz: quizID },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      const totalApprovals = await Approved.countDocuments({ quiz: quizID });
  
      // If 2 or more unique approvals → approve quiz + delete approvals
      if (totalApprovals >= 2) {
        await Quiz.findByIdAndUpdate(quizID, { approved: true });
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizID, { approved: true }, { new: true });
        await Approved.deleteMany({ quiz: quizID });
        return res.status(200).json({
            success: true,
            message: "Quiz approved and approvals cleared",
            data: updatedQuiz
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Approval recorded. Waiting for more approvals.",
        totalApprovals
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "You already approved this quiz" });
      }
      res.status(400).json({ success: false, error: error.message });
    }
};
