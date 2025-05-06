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

module.exports = mongoose.model('Approved', ApprovedSchema);