const { Schema, model } = require('mongoose');

const ArchivedGalleryItem = new Schema({
  fileName: {
    type: String,
    unique: false,
    required: true
  },
  categories: [{
    type: String,
    ref: 'Category'
  }]
});

//Black@Gray
//FineLine
//BlackWork
//NeoTraditional
//Realistic
//Designs
//OldSchool
module.exports = model('ArchivedGalleryItem', ArchivedGalleryItem);
