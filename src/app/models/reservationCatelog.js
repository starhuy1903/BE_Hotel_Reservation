const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationCatelog = new Schema(
  {
    statusName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Reservation Status Catelog",
  reservationCatelog
);
