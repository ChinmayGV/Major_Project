const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const countryMap = require("../init/countryCode.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); //to parse form data
const { storage } = require("../cloudConfig.js");
const upload = multer({
  storage,
  limits: {
    // The value is in bytes. This example sets a 5 MB limit.
    fileSize: 1024 * 1024 * 3,
  },
});

router
  .route("/")
  .get(listingController.index)
  .post(
    isLoggedIn,
    validateListing,
    upload.single("image"),
    listingController.createListing,
    listingController.multerSizehandler
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(listingController.showListing)
  .put(isLoggedIn, validateListing, listingController.editListing)
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
