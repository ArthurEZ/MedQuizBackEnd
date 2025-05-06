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
    subject:{
        type: mongoose.Schema.ObjectId,
        ref: "Subject",
        require: true
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
        type:[String]
    },
    approved:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);