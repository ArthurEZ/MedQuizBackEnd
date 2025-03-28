const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    type:{
        type:String,
        enum: ["choice", "written"],
        required: true
    },
    choice:[{
        type: String

    }],
    correctAnswer:{
        type:String,
        required: true
    },
    img:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);