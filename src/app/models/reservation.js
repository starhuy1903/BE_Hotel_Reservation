const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const reservationSchema = new Schema({
    userId: { type: Schema.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    //tsCreated: { type: Date, require: true },
    //tsUpdated: { type: Date, require: true },
    discountPercent: { type: Number},
    totalPrice: { type: Number, required: true },

}, { timestamps: true })

module.exports = mongoose.model('Reservation', reservationSchema)