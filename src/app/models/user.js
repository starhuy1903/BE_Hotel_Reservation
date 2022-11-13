const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  first_name: {type: String, require: true},
  last_name: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  phoneNumber: {type: String},
  address: {type: String},
  roles: {type: [String], default: ["user"]},
  isActive: {type: Boolean},
  verified: {type: Boolean}
},{timestamps: true});

module.exports = mongoose.model('User', userSchema)