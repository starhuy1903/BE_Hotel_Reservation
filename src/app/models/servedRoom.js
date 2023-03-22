const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const servedRoomSchema = new Schema(
  {
    roomId: { type: Schema.ObjectId, required: true },
    reservationId: { type: Schema.ObjectId, required: true },
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("served_room", servedRoomSchema);
