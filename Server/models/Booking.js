const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  contacts: {
    email: {
      type: String,
      default: null
    },
    insta: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    whatsapp: {
      type: String,
      default: null
    },
    messenger: {
      type: String,
      default: null
    }
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
