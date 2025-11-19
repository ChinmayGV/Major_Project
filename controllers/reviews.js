const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user;
  newReview.listing = listing._id;
  // console.log(newReview);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  // console.log(listing);
  req.flash("success", "thank's for providing your review (:");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  // req.flash("success", "review deleted sucessfully :)");

  let redirectUrl = req.query.redirect_to || `/listings/${id}`;
  res.redirect(redirectUrl);
};
