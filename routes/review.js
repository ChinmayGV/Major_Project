const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
  isVerified,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//Reviews
//Post Route
router.post(
  "/",
  isLoggedIn,
  isVerified,
  validateReview,
  reviewController.createReview
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
