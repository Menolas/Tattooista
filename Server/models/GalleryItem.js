const { Schema, model } = require('mongoose');

const GalleryItem = new Schema({
  fileName: {
    type: String,
    unique: false,
    required: true
  },
  
  categories: [{
    type: String,
    ref: 'TattooStyle'
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Black@Gray
//FineLine
//BlackWork
//NeoTraditional
//Realistic
//Designs
//OldSchool
module.exports = model('GalleryItem', GalleryItem);
