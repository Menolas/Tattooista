const { Schema, model } = require('mongoose');

const ArchivedGalleryItem = new Schema({
  fileName: {
    type: String,
    unique: false,
    required: true
  },
  tattooStyles: [{
    type: String,
    ref: 'TattooStyle'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

//Black@Gray
//FineLine
//BlackWork
//NeoTraditional
//Realistic
//Designs
//OldSchool
module.exports = model('ArchivedGalleryItem', ArchivedGalleryItem);
