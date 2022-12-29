const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const typeRoomSchema = new Schema({
  typeName: {type: String, required: true},
})

module.exports = mongoose.model('Type Room', typeRoomSchema)