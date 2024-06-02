const mongoose = require('mongoose');

const ArchivedBookingSchema = new mongoose.Schema({
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
    default: null,
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
    insta: {
      type: String,
      default: null,
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
      default: null,
    }
  }
});

ArchivedBookingSchema.index(
    { 'contacts.email': 1 },
    { unique: true, partialFilterExpression: { 'contacts.email': { $exists: true } } }
);

ArchivedBookingSchema.index(
    { 'contacts.phone': 1 },
    { unique: true, partialFilterExpression: { 'contacts.phone': { $exists: true } } }
);

ArchivedBookingSchema.index(
    { 'contacts.whatsapp': 1 },
    { unique: true, partialFilterExpression: { 'contacts.whatsapp': { $exists: true } } }
);

ArchivedBookingSchema.pre('save', function(next) {
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

module.exports = mongoose.model('ArchivedBooking', ArchivedBookingSchema);
