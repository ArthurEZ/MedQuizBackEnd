const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true
  },
  img:{
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Subject', subjectSchema);
