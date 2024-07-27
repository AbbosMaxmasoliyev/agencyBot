const { Schema } = require("mongoose");

const mainSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    agree: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    ],
    status: {
        type: Boolean,
        default: false
    }
});

// Ensure there is no unique index on the `agree` field unless intentionally added
mainSchema.index({ agree: 1 }, { unique: false }); // Making sure agree is not unique

module.exports = mainSchema;
