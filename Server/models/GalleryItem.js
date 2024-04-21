const { Schema, model } = require('mongoose');

const GalleryItem = new Schema({
  fileName: {
    type: String,
    unique: false,
    required: true,
  },

  tattooStyles: [{
    type: String,
    ref: 'TattooStyle',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('GalleryItem', GalleryItem);
