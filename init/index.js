const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68ee3d836fd6d07fe3793ba9",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized ");
};

// async function updateListings() {
//   try {
//     const defaultCoordinates = [77.6245, 12.9279]; // [longitude, latitude]

//     const result = await Listing.updateMany(
//       { geometry: { $exists: false } },
//       {
//         $set: {
//           geometry: {
//             type: "Point",
//             coordinates: defaultCoordinates,
//           },
//         },
//       }
//     );

//     console.log("Update successful!");
//     console.log(`${result.modifiedCount} listings were updated.`);
//   } catch (err) {
//     console.error("Error updating listings:", err);
//   }
// }
// let updateCategory = async () => {
//   await Listing.updateMany({}, { $set: { category: "Trending" } });
// };

// updateCategory();

// initDB();
// updateListings();
