const mongoose = require('mongoose');
const mainSchema = require('./constanta');
const Schema = mongoose.Schema;

const AnnounceSchema = mainSchema

AnnounceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Announce = mongoose.model('Announce', AnnounceSchema);

module.exports = Announce;
