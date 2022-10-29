const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hotelSchema = new Schema({
  name: {type: String, require: true},
  type: {type: String, require: true},
  city: {type: String, require: true},
  address: {type: String, require: true},
  distance: {type: String, require: true},
  photos: {type: [String]},
  title: {type: String, require: true},
  desc: {type: String, require: true},
  rating:{
    type: Number,
    min: 0,
    max: 5
  },
  rooms:{
    type: [String]
  },
  cheapest_price: {type: Number, require: true},
  featured: {type: Boolean, default: false},
});

module.exports = mongoose.model('Hotel', hotelSchema)