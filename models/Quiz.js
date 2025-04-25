const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true,
    },
    type:{
        type:String,
        enum: ["multi-choice","choice", "written"],
        required: true
    },
    choice:{
        type: [String]
    },
    correctAnswer:{
        type:[String],
        required: true
    },
    img:{
        type:String
    },
    proved: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    },    
    isApproved: {
        type: Boolean,
        default: false,
    },
    pendingDelete: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);