const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3333;
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const countryMap = require("./init/countryCode.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
// This middleware function can be placed after your 'require' statements

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
main()
  .then((res) => {
    console.log("connected successfully to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLusT");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Hi I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", validateListing, async (req, res) => {
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
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing, countryMap });
});

//Update Route
app.put("/listings/:id", validateListing, async (req, res) => {
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
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  //   res.send("deleted successfully");

  await Listing.findByIdAndDelete(id);

  res.redirect("/listings");
});

// app.get("/listtesting", async (req, res) => {
//   let sampleData = new Listing({
//     title: "The Lion Den",
//     description: "Inside the Beach",
//     price: 11111,
//     location: "Calangute , Goa",
//     country: "India",
//   });
//   await sampleData.save();
//   console.log("sample was saved");
//   res.send("sucessful");
// });

app.all(/.*/, (req, res) => {
  throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { err, statusCode, message });
});

app.listen(port, () => {
  console.log(`Server is Listening to the Port:${port}`);
});
