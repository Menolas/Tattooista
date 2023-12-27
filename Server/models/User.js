const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  avatar: {
    type: String
  },

  displayName: {
    type: String,
    unique: true,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  roles: [{
    type: String,
    ref: 'Role'
  }],

  isActivated: {
    type: Boolean,
    default: false
  },

  activationLink: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model('User', UserSchema)
