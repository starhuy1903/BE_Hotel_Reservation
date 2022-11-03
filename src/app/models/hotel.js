const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hotelSchema = new Schema({
  name: {type: String, require: true},
  address: {type: String, require: true},
  photos: {type: [String]},
  description: {type: String, require: true},
  phone_number: {type: String},
  rooms:{type: [String]},
  cheapest_price: {type: Number, require: true},
  featured: {type: Boolean, default: false},
  category_id: {type: ObjectId}
});

module.exports = mongoose.model('Hotel', hotelSchema)