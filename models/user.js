const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const modelName = 'User';

const schema = new Schema({
  name: String,
  photo: String,
  phone: String,
  email: String,
  city: String,
  password: String
}, {timestamps: true});

module.exports = mongoose.model(modelName, schema);
