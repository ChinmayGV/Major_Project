const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next) => {
  // 1. Validate the request body against your schema
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // 2. If there is an error, extract the message and throw it
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // 3. If there is no error, call next() to proceed to the route handler
    next();
  }
};
//Reviews
//Post Route
router.post("/", validateReview, async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  // console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created (:");
  res.redirect(`/listings/${req.params.id}`);
});

//Delete Review Route
router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted ):");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
