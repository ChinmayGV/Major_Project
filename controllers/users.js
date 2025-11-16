const User = require("../models/user.js");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const transporter = require("../config/nodemail.js");
const { sendVerificationEmail } = require("../config/sendVerificationEmail.js");
module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

// module.exports.signup = async (req, res) => {
//   try {
//     let { username, password, email } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);
//     // console.log(registeredUser);
//     // req.flash("success", `Hey ${username} you registered Successfully`);
//     // res.redirect("/listings");

//     //by doing this req.isAunthenticated() will be false

//     req.login(registeredUser, (err) => {
//       if (err) {
//         return next(err); // Pass errors to Express error handler
//       }
//       // Now a session is established, and req.isAuthenticated() will be true.
//       req.flash(
//         "success",
//         "Welcome to Wanderlust! You registered Successfully."
//       );
//       res.redirect("/listings"); // Or wherever you want them to go
//     });
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// };
module.exports.signup = async (req, res, next) => {
  // Added 'next' for error handling
  try {
    let { username, password, email } = req.body;

    // Create the new user instance
    const newUser = new User({ email, username });

    // 1. Register the user (Passport-local-mongoose hashes password)
    // The 'isVerified' field is 'false' by default from your schema
    const registeredUser = await User.register(newUser, password);

    // 2. Generate the verification token
    const token = crypto.randomBytes(20).toString("hex");
    registeredUser.emailVerificationToken = token;
    registeredUser.emailVerificationExpires = Date.now() + 3600000; // 1 hour

    // Save the user with the token and expiry
    await registeredUser.save();

    const verificationLink = `http://${req.headers.host}/verify-email?token=${token}`;

    // --- UNCOMMENT THIS BLOCK TO SEND REAL EMAIL ---
    await transporter.sendMail({
      to: registeredUser.email,
      from: ` <${process.env.EMAIL_USER}>`, // Must be your authenticated email
      subject: "Verify Your Email for Wanderlust",
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for signing up! Please click the link below to verify your email address:</p>
        <a href="${verificationLink}" style="padding: 10px 15px; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <br>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    });

    // --- For Testing (simulates sending the link) ---
    // You can copy/paste this link from your terminal to test verification
    console.log("--- VERIFICATION LINK (FOR TESTING) ---");
    console.log(verificationLink);
    console.log("---------------------------------------");

    // 4. Do NOT log them in. Instead, flash a message and redirect.
    // We have removed the req.login() block

    req.flash("success", "click on the link sent to your email");
    res.redirect("/signup/email"); // Send them to the login page
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", `Welcome  ${req.body.username} `);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;

    // 1. Find user with this token and check if it's expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }, // $gt = greater than
    });

    if (!user) {
      req.flash("error", "Verification token is invalid or has expired.");
      return res.redirect("/login");
    }

    // 2. If token is valid, verify the user
    user.isVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    user.emailVerificationExpires = undefined; // Clear the expiry

    await user.save();

    req.flash("success", "Email verified successfully! You can now log in.");
    // res.redirect("/listings");
    req.login(user, (err) => {
      if (err) {
        return next(err); // Pass errors to Express error handler
      }
      // Now a session is established, and req.isAuthenticated() will be true.
      req.flash(
        "success",
        "Welcome to Wanderlust!You registered Successfully."
      );
      res.redirect("/listings"); // Or wherever you want them to go
    });
  } catch (e) {
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
};

module.exports.renderEmailPage = (req, res) => {
  res.render("partials/emailPage.ejs");
};

module.exports.renderReVerifyEmailPage = (req, res) => {
  res.render("users/resendVerificationPage.ejs", { email: req.user.email });
};

module.exports.resendEmail = async (req, res) => {
  try {
    const { email: newEmail } = req.body;
    const user = await User.findById(req.user._id);

    // 1. Generate a secure random token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken; // Ensure your User model has this field
    user.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour expiry

    let flashMessage = "";

    // CASE 1: User updated their email address
    if (newEmail !== user.email) {
      user.email = newEmail;
      user.isEmailVerified = false; // Mark new email as unverified
      flashMessage = `Email address updated. A verification link has been sent to ${user.email}.`;
    }
    // CASE 2: User is resending to the SAME email
    else {
      flashMessage = `A new verification link has been sent to ${user.email}.`;
    }

    // Save changes (new token, new expiry, and potentially new email)
    await user.save();

    // 2. Create the full verification URL
    // Make sure to set "BASE_URL" in your .env file (e.g., http://localhost:3000)
    const verificationLink = `http://${req.headers.host}/verify-email?token=${verificationToken}`;

    // 3. Send the email with the link
    await sendVerificationEmail(user.email, verificationLink);

    req.flash("success", flashMessage + " Please check your inbox.");
    // Redirect back to the same page, or wherever you prefer
    res.redirect("/signup/email");
  } catch (e) {
    console.error("Error in resend-verification:", e);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/signup/email");
  }
};
