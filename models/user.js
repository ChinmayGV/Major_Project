const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  profilePicture: {
    type: String,
    // default:
    //   "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
  },
  profilePictureId: {
    type: String,
  },
  age: {
    type: Number,
    min: [1, "Age must be positive"],
    max: [120, "Enter a valid age"],
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  phone: {
    type: String,
    trim: true,
    // This regex enforces exactly 10 digits (0-9)
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
  },

  preferences: [
    {
      type: String,
    },
  ],
});

userSchema.plugin(passportLocalMongoose);
//this mongoose plugin help in creating username , salting ,hashing automatically

module.exports = mongoose.model("User", userSchema);
