const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category:{
        type: String,
        require: true
    },   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', CategorySchema);