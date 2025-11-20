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
    const userId = req.user._id;
    let { username, age, gender, phone, preferences, removePicture, email } =
      req.body;

    const userToUpdate = await User.findById(userId);

    // =========================================================================
    // 1. UNIQUE USERNAME CHECK
    // =========================================================================
    if (username !== userToUpdate.username) {
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        req.flash("error", "That username is already taken.");
        return res.redirect("/myProfile");
      }
    }

    // =========================================================================
    // 2. UNIQUE EMAIL CHECK & VERIFICATION RESET (NEW LOGIC)
    // =========================================================================
    let emailChanged = false;

    if (email !== undefined && email.trim() === "") {
      req.flash("error", "Email can't be empty");
      return res.redirect("/myProfile");
    }

    if (email && email.trim() !== "" && email !== userToUpdate.email) {
      // Check if someone else already uses the new email
      const existingUserWithNewEmail = await User.findOne({ email });

      if (
        existingUserWithNewEmail &&
        !existingUserWithNewEmail._id.equals(userId)
      ) {
        req.flash(
          "error",
          "That email address is already registered by another user."
        );
        return res.redirect("/myProfile");
      }

      emailChanged = true;
    }

    // =========================================================================
    // 3. CONSTRUCT UPDATE DATA
    // =========================================================================
    let updateData = {
      username: username,
      email: email, // <-- Add email here
      age: age,
      gender: gender,
      phone: phone,
      preferences: preferences
        ? Array.isArray(preferences)
          ? preferences
          : [preferences]
        : [],
    };

    // If the email was changed, we must reset the verification status
    if (emailChanged) {
      updateData.isVerified = false;
      updateData.emailVerificationToken = null; // Clear old token if any
      updateData.emailVerificationExpires = null;
    }

    // =========================================================================
    // 4. PICTURE HANDLING (Original Logic)
    // =========================================================================
    // ... (Keep the rest of your original logic for removePicture and req.file)

    // profile picture deletion handling ---//
    if (removePicture === "true") {
      if (userToUpdate.profilePictureId) {
        // Assuming 'cloudinary' is defined and imported elsewhere
        await cloudinary.uploader.destroy(userToUpdate.profilePictureId);
      }

      updateData.profilePicture = null; // Set DB field to null
      updateData.profilePictureId = null;
    }
    // CASE B: User uploaded a NEW photo
    else if (req.file) {
      // Assuming req.file is from Multer/Cloudinary setup
      updateData.profilePicture = req.file.path; // Save the new Cloudinary URL
      updateData.profilePictureId = req.file.filename;
    }

    // =========================================================================
    // 5. EXECUTE UPDATE & RE-LOGIN
    // =========================================================================
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    req.login(updatedUser, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      let successMessage = "Profile updated successfully!";
      if (emailChanged) {
        successMessage += "Verify Email ";
      }

      req.flash("success", successMessage);
      res.redirect("/myProfile");
    });
  } catch (e) {
    console.log(e);
    // Handle Mongoose validation errors or unexpected errors
    req.flash("error", "An error occurred. Please check details or try again.");
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

module.exports.renderMyListingPage = async (req, res) => {
  try {
    let listings = await Listing.find({ owner: req.user._id });

    res.render("options/mylistings.ejs", { listings });
  } catch (err) {
    console.error("Error fetching user listings:", err);
    req.flash("error", "Could not load your listings.");
    res.redirect("/");
  }
};
