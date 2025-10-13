const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const countryMap = require("../init/countryCode.js");

const validateListing = (req, res, next) => {
  // 1. Validate the request body against your schema
  const { error } = listingSchema.validate(req.body);
  if (error) {
    // 2. If there is an error, extract the message and throw it
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    // 3. If there is no error, call next() to proceed to the route handler
    next();
  }
};

//Index Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  // console.log(req.body);
  res.render("listings/show.ejs", { listing });
});

//Create Route
router.post("/", validateListing, async (req, res) => {
  const newListingData = req.body;
  const countryName = countryMap[newListingData.country];

  await Listing.create({
    ...newListingData,
    country: countryName,
    image: {
      filename: "listingimage",
      url: newListingData.image,
    },
  });
  req.flash("success", "New Listing Created (:");
  res.redirect("/listings");
});

//Edit Route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, countryMap });
});

//Update Route
router.put("/:id", validateListing, async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  //   res.send("deleted successfully");
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});

module.exports = router;
