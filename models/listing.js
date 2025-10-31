const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Mountains",
      "Iconic Cities",
      "Castles",
      "Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Boats",
      "Domes",
    ],
    default: "Rooms",
  },
  location: {
    type: String,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// listingSchema.post("findOneAndDelete", async (listing) => {
//   // This function will run after a listing is deleted
//   if (listing && listing.reviews.length) {
//     // If the deleted listing had reviews...
//     const result = await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
