const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationStatusEventSchema = new Schema({
    room_reserved_id: {type: Schema.ObjectId, require: true},
    reservation_status_catelog_id: {type: String, require: true},
    details: {type: String, require: true}, 
    ts_created: {type: Date, require: true},
}, {timestamps: true});

module.exports = mongoose.model('ReservationStatusEvent', reservationStatusEventSchema)