const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
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
    trim: true
  }
})

BookingSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true } } }
)

BookingSchema.index(
    { phone: 1 },
    { unique: true, partialFilterExpression: { phone: { $exists: true } } }
)

BookingSchema.index(
    { whatsapp: 1 },
    { unique: true, partialFilterExpression: { whatsapp: { $exists: true } } }
)

BookingSchema.pre('save', function(next) {
  if (this.email === null || this.email === "") {
    this.email = undefined;
  }
  if (this.phone === null || this.phone === "") {
    this.phone = undefined;
  }
  if (this.whatsapp === null || this.whatsapp === "") {
    this.whatsapp = undefined;
  }
  next()
})

module.exports = mongoose.model('Booking', BookingSchema)
