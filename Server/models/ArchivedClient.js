const mongoose = require('mongoose');

const ArchivedClientSchema = new mongoose.Schema({
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
      unique: true,
      sparse: true,
    },
    insta: {
      type: String,
      trim: true,
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
      trim: true
    }
  },
  gallery: [{type: String}],
});

ArchivedClientSchema.index(
    { 'contacts.email': 1 },
    { unique: true, partialFilterExpression: { 'contacts.email': { $exists: true } } }
);

ArchivedClientSchema.index(
    { 'contacts.phone': 1 },
    { unique: true, partialFilterExpression: { 'contacts.phone': { $exists: true } } }
);

ArchivedClientSchema.index(
    { 'contacts.whatsapp': 1 },
    { unique: true, partialFilterExpression: { 'contacts.whatsapp': { $exists: true } } }
);

ArchivedClientSchema.pre('save', function(next) {
  if (this.contacts.email === null || this.contacts.email === "") {
    this.contacts.email = undefined;
  }
  if (this.contacts.phone === null || this.contacts.phone === "") {
    this.contacts.phone = undefined;
  }
  if (this.contacts.whatsapp === null || this.contacts.whatsapp === "") {
    this.contacts.whatsapp = undefined;
  }
  next();
});

module.exports = mongoose.model('ArchivedClient', ArchivedClientSchema);

