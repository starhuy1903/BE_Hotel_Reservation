const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const verifyTokenSchema = new Schema({
  user_id: {type: Schema.ObjectId, required: true},
  key: {type: String, required: true},
},{timestamps: true})

verifyTokenSchema.index({createdAt: 1},{expireAfterSeconds: 3600*24*5});
module.exports = mongoose.model('verifyToken', verifyTokenSchema)