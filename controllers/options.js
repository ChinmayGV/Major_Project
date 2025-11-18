const Review = require("../models/review.js");
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig.js");

module.exports.renderMyProfilePage = (req, res) => {
  let user = req.user;
  res.render("options/profile.ejs", { currUser: user });
};

module.exports.renderMyReviewsPage = async (req, res) => {
  let reviews = await Review.find({ author: req.user._id }).populate("listing");
  //   console.log(reviews[0].listing.image.url);
  //   console.log(reviews);
  res.render("options/myreviews.ejs", { reviews });
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    // 1. Get the User ID (from the logged-in session)
    const userId = req.user._id;
    let { username, age, gender, phone, preferences, removePicture } = req.body;

    const userToUpdate = await User.findById(userId);

    //check if username exist in DB
    if (username !== req.user.username) {
      // Check if someone else already has it
      const existingUser = await User.findOne({ username: username });

      if (existingUser) {
        req.flash("error", "That username is already taken.");
        return res.redirect("/myProfile");
      }
    }

    let updateData = {
      username: username,
      age: age,
      gender: gender,
      phone: phone,
      // Ensure preferences is always an array.
      // If user sends 1 item, it might be a string, so we wrap it.
      preferences: preferences
        ? Array.isArray(preferences)
          ? preferences
          : [preferences]
        : [],
    };

    // profile picture deletion handling ---//
    if (removePicture === "true") {
      if (userToUpdate.profilePictureId) {
        await cloudinary.uploader.destroy(userToUpdate.profilePictureId);
      }

      updateData.profilePicture = null; // Set DB field to null
      updateData.profilePictureId = null;
    }
    // CASE B: User uploaded a NEW photo
    else if (req.file) {
      updateData.profilePicture = req.file.path; // Save the new Cloudinary URL
      updateData.profilePictureId = req.file.filename;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    req.login(updatedUser, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      req.flash("success", "Profile updated successfully!");
      res.redirect("/myProfile");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", "Please enter valid Details  ");
    res.redirect("/myProfile");
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const userId = req.user._id;

  try {
    // 1. Perform Data Cleanup (Removing Reviews and Listings)

    // Find and delete all Listings owned by this user
    // (Assuming your Listing model has a field like 'owner' or 'author' referencing the User ID)
    await Listing.deleteMany({ owner: userId });

    // Find and delete all Reviews authored by this user
    await Review.deleteMany({ author: userId });

    // 2. Delete the User Document
    await User.findByIdAndDelete(userId);

    // 3. Destroy Session (Logout)
    // Passport's logout function is asynchronous and destroys the session
    req.logout((err) => {
      if (err) return next(err);

      // 4. Flash message and redirect
      req.flash(
        "success",
        "Your account has been successfully deleted. Goodbye!"
      );
      res.redirect("/listings");
    });
  } catch (e) {
    console.error("Error during user deletion cleanup:", e);
    req.flash("error", "Error deleting account and associated data.");

    res.redirect("/myProfile");
  }
};
