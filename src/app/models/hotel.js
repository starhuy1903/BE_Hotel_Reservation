const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    photos: { type: [String] },
    description: { type: String, require: true },
    phone_number: { type: String },
    cheapest_price: { type: Number, required: true },
    category_id: { type: ObjectId, required: true },
    owner_id: { type: ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hotel", hotelSchema);
