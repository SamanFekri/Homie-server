const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const modelName = 'Home';

const schema = new Schema({
    title: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    city: Number,
    description: String,
    tenants_number: Number,
    room_type: Number,
    bed_type: Number,
    bedroom_number: Number,
    bathroom_number: Number,
    smoke: Boolean,
    pet: Boolean,
    guest: Boolean,
    bills: Boolean,
    price: Number,
    photos: [],
}, {timestamps: true});

module.exports = mongoose.model(modelName, schema);

