const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hotelSchema = new Schema({
  name: {type: String, require: true},
  address: {type: String, require: true},
  city:{type: String, require: true},
  photos: {type: [String]},
  description: {type: String, require: true},
  phone_number: {type: String},
  cheapest_price: {type: Number, require: true},
  category_id: {type: ObjectId,require: true},
  owner_id: {type: ObjectId,require: true},
});

module.exports = mongoose.model('Hotel', hotelSchema)