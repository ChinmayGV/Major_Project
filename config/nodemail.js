// config/nodemailer.js

const nodemailer = require("nodemailer");

// Create the transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use "Gmail"
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your App Password from .env
  },
});

module.exports = transporter;
