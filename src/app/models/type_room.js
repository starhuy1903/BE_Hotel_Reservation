const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const typeRoomSchema = new Schema({
  type_name: {type: String, require: true},
});

module.exports = mongoose.model('Type Room', typeRoomSchema)