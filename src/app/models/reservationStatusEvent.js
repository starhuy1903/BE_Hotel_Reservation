const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationStatusEventSchema = new Schema(
  {
    reservationId: { type: Schema.ObjectId, required: true },
    reservationStatusCatalogId: { type: Schema.ObjectId, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "reservation_status_event",
  reservationStatusEventSchema
);
