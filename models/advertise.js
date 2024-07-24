const mongoose = require('mongoose');
const mainSchema = require('./constanta');

const AdvertiseSchema = mainSchema


AdvertiseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Advertise = mongoose.model('Advertise', AdvertiseSchema);

module.exports = Advertise;
