const mongoose = require('mongoose');

const ApprovedSchema = new mongoose.Schema({
    admin:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },   
    quiz:{
        type: mongoose.Schema.ObjectId,
        ref: "Quiz",
        required: true
    },
    Approved: {
        type: Boolean,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ApprovedSchema.index({ admin: 1, quiz: 1 }, { unique: true }); // prevent duplicate approvals

module.exports = mongoose.model('Approved', ApprovedSchema);