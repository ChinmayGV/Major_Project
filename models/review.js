const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const revieSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing", // This MUST match the name inside mongoose.model("Listing", ...)
  },
});
module.exports = mongoose.model("Review", revieSchema);
