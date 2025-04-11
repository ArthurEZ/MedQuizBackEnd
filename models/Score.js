const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    Category: {
        type: String,
        require: true
    },
    Score: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', ScoreSchema);