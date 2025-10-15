const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    // req.flash("success", `Hey ${username} you registered Successfully`);
    // res.redirect("/listings");

    //by doing this req.isAunthenticated() will be false

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // Pass errors to Express error handler
      }
      // Now a session is established, and req.isAuthenticated() will be true.
      req.flash(
        "success",
        "Welcome to Wanderlust! You registered Successfully."
      );
      res.redirect("/listings"); // Or wherever you want them to go
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", `Welcome back ${req.body.username} `);
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
