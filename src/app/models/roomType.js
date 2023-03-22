const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeRoomSchema = new Schema({
  typeName: { type: String, required: true },
});

module.exports = mongoose.model("room_type ", typeRoomSchema);
