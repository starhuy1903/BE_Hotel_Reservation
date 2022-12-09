const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const bookingSchema = new Schema({
    roomId: { type: Schema.ObjectId, require: true },
    userId: { type: Schema.ObjectId, require: true },
    startDate: { type: Schema.Date, require: true },
    endDate: { type: Schema.Date, require: true },
    bookingStatus: { type: String, require: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema)