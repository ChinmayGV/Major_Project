const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3333;
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const countryMap = require("./init/countryCode.js");

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
app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  let countryCode = req.body.country;
  let countryName = countryMap[countryCode];
  await Listing.insertOne({
    title: title,
    description: description,
    image: {
      filename: "listingimage",
      url: image,
    },
    price: price,
    location: location,
    country: countryName,
  });
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  let countryCode = req.body.country;
  let countryName = countryMap[countryCode];
  await Listing.findByIdAndUpdate(
    id,
    {
      title: title,
      description: description,
      image: {
        filename: "listingimage",
        url: image,
      },
      price: price,
      location: location,
      country: countryName,
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

app.listen(port, () => {
  console.log(`Server is Listening to the Port:${port}`);
});
