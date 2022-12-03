const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roomServedSchema = new Schema({
  roomId: {type: Schema.ObjectId, require: true},
  reservationId: {type: Schema.ObjectId, require: true},
  price: {type: Number}
},{timestamps: true});

module.exports = mongoose.model('Room Served', roomServedSchema)

