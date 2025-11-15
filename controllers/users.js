const User = require("../models/user.js");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const transporter = require("../config/nodemail.js");
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
      from: "your-email@wanderlust.com", // Must be your authenticated email
      subject: "Verify Your Email for Wanderlust",
      html: `
        <p>Thanks for registering for Wanderlust!</p>
        <p>Please click this link to verify your email:</p>
        <a href="${verificationLink}">${verificationLink}</a>
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
    res.redirect("/login"); // Send them to the login page
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
