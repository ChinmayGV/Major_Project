const Listing = require("../models/listing.js");
const countryMap = require("../init/countryCode.js");
const multer = require("multer");
const ExpressError = require("../utils/ExpressError.js");
const axios = require("axios");
const Fuse = require("fuse.js");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  const allListings = await Listing.find(filter);
  if (allListings.length === 0) {
    req.flash("error", `Currently no place under ${category} section`);
    res.redirect("/listings");
    return;
  }
  res.render("./listings/index.ejs", {
    allListings,
    currentCategory: category,
  });
};
module.exports.search = async (req, res) => {
  try {
    // 1. FIX: Get 'search' from req.query, not 'q'
    const query = req.query.q;
    if (!query) {
      res.redirect("/listings");
      return;
    }

    const allListings = await Listing.find({});

    const options = {
      keys: ["title", "location", "country"],
      includeScore: true,
      threshold: 0.2,
    };

    const fuse = new Fuse(allListings, options);
    const results = fuse.search(query);
    const searchResults = results.map((result) => result.item);
    if (searchResults.length === 0) {
      req.flash("error", "No listings found matching that search.");
      res.redirect("/listings");
      return;
    }

    res.render("listings/index.ejs", {
      allListings: searchResults, // This should be 'allListings' if using index.ejs
      query: query,
    });
  } catch (err) {
    console.error(err);
    // Handle errors
  }
};
module.exports.suggestion = async (req, res) => {
  try {
    const { q } = req.query;

    // If the query is empty, send no suggestions
    if (!q) {
      return res.json([]);
    }

    // Create a case-insensitive regex to find titles
    // that *start with* the query string (the '^' symbol).
    // This is fast and what you want for autocomplete.
    const searchRegex = new RegExp("^" + q, "i");

    // Find matching listings
    const suggestions = await Listing.find({ title: { $regex: searchRegex } })
      .select("title") // IMPORTANT: Only get the 'title' field
      .limit(10); // IMPORTANT: Only send a few suggestions

    // Map the results to a simple array of strings
    const titles = suggestions.map((listing) => listing.title);

    res.json(titles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
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
  const locationString = req.body.location;

  // The URL for the OpenCage API
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json`;

  // The parameters for the request, including your key
  const params = {
    q: locationString,
    key: process.env.OPENCAGE_MAP_TOKEN,
    limit: 1,
  };

  // Make the API call
  const response = await axios.get(geocodeUrl, { params });
  const geometry = response.data.results[0].geometry;
  // const newListing = new Listing(req.body.listing);
  // newListing.location.coordinates = [geometry.lng, geometry.lat];
  const newListingData = req.body;
  const countryName = countryMap[newListingData.country];

  await Listing.create({
    ...newListingData,
    country: countryName,
    image: {
      filename: filename,
      url: url,
    },
    geometry: {
      type: "Point",
      coordinates: [geometry.lng, geometry.lat],
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

  const locationString = req.body.location;
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json`;
  const params = {
    q: locationString,
    key: process.env.OPENCAGE_MAP_TOKEN,
    limit: 1,
  };
  const response = await axios.get(geocodeUrl, { params });
  const geometry = response.data.results[0].geometry;
  let result = await Listing.findByIdAndUpdate(
    id,
    {
      ...newListingData,
      country: countryName,
      geometry: {
        type: "Point",
        coordinates: [geometry.lng, geometry.lat],
      },
    },
    { runValidators: true }
  );
  console.log(result);
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    await Listing.findByIdAndUpdate(
      id,
      {
        ...newListingData,
        country: countryName,
        image: {
          filename: filename,
          url: url,
        },
        geometry: {
          type: "Point",
          coordinates: [geometry.lng, geometry.lat],
        },
      },
      { runValidators: true }
    );
  }

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
