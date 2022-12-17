const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cartSchema = new Schema({
    reservationId: { type: Schema.ObjectId, require: true },
    userId: { type: Schema.ObjectId, require: true }
});

module.exports = mongoose.model('Cart', cartSchema)