const mongoose = require('mongoose');
const mainSchema = require('./constanta');

const CollaborationSchema = mainSchema

CollaborationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Collaboration = mongoose.model('Collaboration', CollaborationSchema);

module.exports = Collaboration;
