const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  wallPaper: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Page', PageSchema);
