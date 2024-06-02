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
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  contacts: {
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    whatsapp: {
      type: String,
      unique: true,
      sparse: true,
    },
    messenger: {
      type: String,
      trim: true,
    },
    insta: {
      type: String,
      trim: true,
    },
  }
});

BookingSchema.index(
    { 'contacts.email': 1 },
    { unique: true, partialFilterExpression: { 'contacts.email': { $exists: true } } }
);

BookingSchema.index(
    { 'contacts.phone': 1 },
    { unique: true, partialFilterExpression: { 'contacts.phone': { $exists: true } } }
);

BookingSchema.index(
    { 'contacts.whatsapp': 1 },
    { unique: true, partialFilterExpression: { 'contacts.whatsapp': { $exists: true } } }
);

BookingSchema.pre('save', function(next) {
  if (!this.contacts.email) {
    this.contacts.email = undefined;
  }
  if (!this.contacts.phone) {
    this.contacts.phone = undefined;
  }
  if (!this.contacts.whatsapp) {
    this.contacts.whatsapp = undefined;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
