const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  contacts: {
    email: {
      type: String,
      default: null,
    },
    insta: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    whatsapp: {
      type: String,
      default: null,
    },
    messenger: {
      type: String,
      default: null,
    }
  },
  gallery: [{type: String}],
})

module.exports = mongoose.model('Client', ClientSchema);
