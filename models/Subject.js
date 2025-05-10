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
  year:{
    type: Number,
    require: true,
    min: 1,
    max: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

subjectSchema.virtual("Category", {
  ref: "Category",
  localField: "_id",
  foreignField: "subject",
  justOne: false,
});

module.exports = mongoose.model('Subject', subjectSchema);
