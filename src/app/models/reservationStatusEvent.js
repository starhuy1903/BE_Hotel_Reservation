const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationStatusEventSchema = new Schema({
    roomReservedId: { type: Schema.ObjectId, require: true },
    reservationStatusCatalogId: { type: String, require: true },
    details: { type: String, require: true },
    tsCreated: { type: Date, require: true },
}, { timestamps: true });

module.exports = mongoose.model('ReservationStatusEvent', reservationStatusEventSchema)