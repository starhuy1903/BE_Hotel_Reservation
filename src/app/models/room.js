const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roomSchema = new Schema({
  room_name: {type: String, require: true},
  available: {type: Boolean,require: true},
  current_price: {type: Number, require: true},
  floor: {type: Number, require: true},
  assets: {},
  room_type_id: {type: Schema.ObjectId, require: true},
  hotel_id: {type: Schema.ObjectId, require: true, ref: 'Hotel'},
  photos: {type: [String]},
  description: {type: String, default: false},
  maxPeople: {type: Number, require: true}
 
},{timestamps: true});

module.exports = mongoose.model('Room', roomSchema)

