const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationSchema = new Schema({
    user_id: {type: Schema.ObjectId, require: true},
    start_date: {type: Date, require: true},
    end_date: {type: Date, require: true},
    ts_created: {type: Date, require: true},
    ts_updated: {type: Date, require: true},
    discount_percent: {type: Double, require: true},
    total_price: {type: Double, require: true},

}, {timestamps: true});

model.exports = mongoose.model('Reservation', reservationSchema)