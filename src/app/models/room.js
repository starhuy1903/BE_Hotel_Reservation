const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roomSchema = new Schema({
  title: {type: String, require: true},
  price: {type: Number, require: true},
  maxPeople: {type: Number, require: true},
  desc: {type: String, default: false},
  roomNumbers:[{number: Number, unavailableDates: {type: [Date]}}]
},{timestamps: true});

module.exports = mongoose.model('Room', roomSchema)