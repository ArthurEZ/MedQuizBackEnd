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
      const { role, id: adminID } = req.user;
      const { quizID } = req.params;
      const { Approved: isApproved } = req.body; // Boolean: true = approve, false = deny
  
      if (!['admin', 'S-admin'].includes(role)) {
        return res.status(403).json({ success: false, message: "You have no permission to approve or deny quizzes" });
      }
  
      if (typeof isApproved !== 'boolean') {
        return res.status(400).json({ success: false, message: "'Approved' field must be a boolean" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(quizID)) {
        return res.status(400).json({ success: false, message: "Invalid quiz ID" });
      }
  
      const quiz = await Quiz.findById(quizID);
      if (!quiz) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }
  
      // S-admin can approve directly
      if (role === 'S-admin' && isApproved === true) {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizID, { approved: true }, { new: true });
        await Approved.deleteMany({ quiz: quizID }); // clear any previous approvals
        return res.status(200).json({
          success: true,
          message: "Quiz approved directly by S-admin",
          data: updatedQuiz
        });
      }
  
      // Save admin approval/denial
      await Approved.findOneAndUpdate(
        { admin: adminID, quiz: quizID },
        { Approved: isApproved },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      // Count approvals and denials
      const approvals = await Approved.countDocuments({ quiz: quizID, Approved: true });
      const denials = await Approved.countDocuments({ quiz: quizID, Approved: false });
  
      if (approvals >= 2) {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizID, { approved: true }, { new: true });
        await Approved.deleteMany({ quiz: quizID });
        return res.status(200).json({
          success: true,
          message: "Quiz approved by 2 admins",
          data: updatedQuiz
        });
      }
  
      if (denials >= 2) {
        await Quiz.findByIdAndDelete(quizID);
        await Approved.deleteMany({ quiz: quizID });
        return res.status(200).json({
          success: true,
          message: "Quiz denied and deleted by 2 admins"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: `Your decision has been recorded. Waiting for more responses.`,
        approvals,
        denials
      });
  
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  };
  