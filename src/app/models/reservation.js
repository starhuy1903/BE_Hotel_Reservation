const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationSchema = new Schema({
    userId: { type: Schema.ObjectId, require: true },
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    //tsCreated: { type: Date, require: true },
    //tsUpdated: { type: Date, require: true },
    discountPercent: { type: Number, require: true },
    totalPrice: { type: Number, require: true },

}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema)