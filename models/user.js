const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Gender = Object.freeze({
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
})


const userSchema = new Schema({

    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false
    },

    status: {
        type: Boolean,
        deafult: false
    },
    web_app: {
        category: String,
        gender: String,
        instagram: String,
        telegram: String,
        instagram_post_price: Number,
        instagram_reels_price: Number,
        instagram_stories_price: Number,
        telegram_post_price: Number,
        you_tube_price: Number,
        youtube: String,
        direction: String,
        role: String,
        userTelegramId: {
            type: String,

            unique: true,
            sparse: true
        }
    },
    action: {
        type: String,
        default: "telegram"
    },
    is_bot: { type: Boolean, default: false },
    language_code: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
