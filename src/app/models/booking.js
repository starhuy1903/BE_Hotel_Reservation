const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const bookingSchema = new Schema({
    room_id: {type: Schema.ObjectId, require: true},
    user_id: {type: Schema.ObjectId, require: true},
    start_date: {type: Schema.Date, require: true},
    end_date: {type: Schema.Date, require: true},
    booking_status: {type: String, require: true},
}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema)
