const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationCatelog = new Schema({
  statusName: {type: String, require: true},
});

module.exports = mongoose.model('Reservation Status Catelog', reservationCatelog)