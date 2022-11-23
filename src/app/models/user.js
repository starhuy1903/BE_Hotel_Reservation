const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Joi = require('joi');

const userSchema = new Schema({
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  first_name: {type: String, require: true},
  last_name: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  phoneNumber: {type: String},
  address: {type: String},
  roles: {type: [String]},
  isActive: {type: Boolean},
  verified: {type: Boolean}
},{timestamps: true});


// const validate = (user) => {
//   const schema = {
//     username: Joi.string().required(),
//     password: Joi.string().required(),
//     //first_name: Joi.string().required(),
//     //last_name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     //phoneNumber: Joi.string(),
//     //address: Joi.string(),
//     //roles: Joi.array().items(Joi.string()),
//     //isActive: Joi.boolean()
//   }
//   return Joi.validate(user, schema);
// }

module.exports = mongoose.model('User', userSchema);
// module.exports = {validate};