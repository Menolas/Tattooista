const mongoose = require('mongoose')


const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  title: {
    type: String
  },
  wallPaper: {
    type: String
  },
  content: String
});

module.exports = mongoose.model('Page', PageSchema)
