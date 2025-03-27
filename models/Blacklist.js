const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000
    }
});

module.exports = mongoose.model('Blacklist', BlacklistSchema);
