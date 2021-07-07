const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const modelName = 'Notification';

const schema = new Schema({
    text: String,
    removed: Boolean,
    show_btn: Boolean,
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
},  {timestamps: true});

module.exports = mongoose.model(modelName, schema);

