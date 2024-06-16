const { Schema, model } = require('mongoose');

const GalleryItem = new Schema({
  fileName: {
    type: String,
    unique: false,
    required: true,
  },

  tattooStyles: [{
    type: Schema.Types.ObjectId,
    ref: 'TattooStyle',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('GalleryItem', GalleryItem);
