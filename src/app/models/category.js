const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
  category_name: {type: String, require: true},
},{ timestamps: true })

module.exports = mongoose.model('Category', categorySchema)