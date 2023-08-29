const { Schema, model } = require('mongoose');

const FaqItem = new Schema({
  question: {
    type: String,
    unique: true
  },
  answer: {
    type: String
  }
});

module.exports = model('FaqItem', FaqItem);
 