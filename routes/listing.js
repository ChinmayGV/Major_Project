const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const countryMap = require("../init/countryCode.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
});

//Create Route
router.post("/", isLoggedIn, validateListing, async (req, res) => {
  const newListingData = req.body;
  const countryName = countryMap[newListingData.country];

  let newlisting = await Listing.create({
    ...newListingData,
    country: countryName,
    image: {
      filename: "listingimage",
      url: newListingData.image,
    },
    owner: req.user._id,
  });
  req.flash("success", "New Listing Created (:");
  res.redirect("/listings");
});

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, countryMap });
});

//Update Route
router.put("/:id", isLoggedIn, validateListing, async (req, res) => {
  let { id } = req.params;
  const newListingData = req.body;
  const countryName = countryMap[newListingData.country];

  await Listing.findByIdAndUpdate(
    id,
    {
      ...newListingData,
      country: countryName,
      image: {
        filename: "listingimage",
        url: newListingData.image,
      },
    },
    { runValidators: true }
  );
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  //   res.send("deleted successfully");
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});

module.exports = router;
