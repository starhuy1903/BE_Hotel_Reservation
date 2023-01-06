const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    address: { type: String },
    roles: { type: [String], enum: ['admin', 'user', 'business'], required: true },
    isActive: { type: Boolean },
    verified: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
