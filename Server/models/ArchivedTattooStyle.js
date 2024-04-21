const { Schema, model } = require('mongoose');

const ArchivedTattooStyle = new Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  wallPaper: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  }
});

module.exports = model('ArchivedTattooStyle', ArchivedTattooStyle);
