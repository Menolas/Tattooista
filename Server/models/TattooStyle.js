const { Schema, model } = require('mongoose')

const TattooStyle = new Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  wallPaper: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  nonStyle: {
    type: Boolean,
    default: false
  }
});

module.exports = model('TattooStyle', TattooStyle)
