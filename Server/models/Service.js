const { Schema, model } = require('mongoose');

const Service = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  wallPaper: {
    type: String,
  },
  conditions: [{type: String}],
})

module.exports = model('Service', Service);
