const { Schema, model } = require('mongoose');

const ReviewSchema = new Schema({

    rate: {
        type: Number,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Review', ReviewSchema);
