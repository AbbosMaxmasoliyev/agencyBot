const { Schema } = require("mongoose")
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
        default: Date.now(),
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    agree: [
        {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User',
            unique: true
        }
    ],
    status: {
        type: Boolean,
        default: false
    }
})


module.exports = mainSchema







