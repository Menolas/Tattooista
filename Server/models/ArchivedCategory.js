const { Schema, model } = require('mongoose');

const Category = new Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  wallPaper: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  }
});

module.exports = model('Category', Category);
