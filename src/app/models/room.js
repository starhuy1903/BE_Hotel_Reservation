const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const roomSchema = new Schema({
  room_name: {type: String, required: true},
  current_price: {type: Number, required: true},
  floor: {type: Number, required: true},
  assets: {},
  room_type_id: {type: Schema.ObjectId, required: true},
  hotel_id: {type: Schema.ObjectId, required: true},
  photos: {type: [String]},
  description: {type: String},
  maxPeople: {type: Number, required: true}
 
},{timestamps: true})

module.exports = mongoose.model('Room', roomSchema)

