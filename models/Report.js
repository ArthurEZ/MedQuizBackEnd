const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },   
    quiz:{
        type: mongoose.Schema.ObjectId,
        ref: "Quiz",
        required: true
    },
    type: {
        type: String,
        enum: ["report", "reply"],
        require: true
    },
    description:{
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ApprovedSchema.index({ admin: 1, quiz: 1 }, { unique: true }); // prevent duplicate approvals

module.exports = mongoose.model('Report', ReportSchema);