const mongoose = require('mongoose');
const mainSchema = require('./constanta');

const BarterSchema = mainSchema;


BarterSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Barter = mongoose.model('Barter', BarterSchema);

module.exports = Barter;
