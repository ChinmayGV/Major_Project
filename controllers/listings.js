const Listing = require("../models/listing.js");
const countryMap = require("../init/countryCode.js");
const multer = require("multer");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListingData = req.body;
  const countryName = countryMap[newListingData.country];

  await Listing.create({
    ...newListingData,
    country: countryName,
    image: {
      filename: filename,
      url: url,
    },
    owner: req.user._id,
  });
  req.flash("success", "New Listing Created (:");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, countryMap });
};

module.exports.editListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  //   res.send("deleted successfully");
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.multerSizehandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    // Handle the specific error for oversized files
    req.flash("error", "File is too large. Maximum size is 5MB.");
    return res.redirect("/listings/new");
  }
  // Handle other errors if needed
  throw new ExpressError(400, error.message);
};
