const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
} = require("../middleware.js");

//Reviews
//Post Route
router.post("/", isLoggedIn, validateReview, async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user;
  console.log(newReview);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log(listing);
  req.flash("success", "New Review Created (:");
  res.redirect(`/listings/${req.params.id}`);
});

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isreviewAuthor, async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted ):");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
