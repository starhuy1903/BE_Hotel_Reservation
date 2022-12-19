const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const reservationStatusEventSchema = new Schema({
    reservationId: { type: Schema.ObjectId, required: true },
    reservationStatusCatalogId: { type: Schema.ObjectId, required: true },
    details: { type: String},
    //tsCreated: { type: Date, require: true },
}, { timestamps: true })

module.exports = mongoose.model('ReservationStatusEvent', reservationStatusEventSchema)