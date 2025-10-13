const express = require("express");
const app = express();
const port = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
  secret: "your-very-secure-secret-key",
  resave: false,
  saveUninitialized: true,
};
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  console.log(req.session);
  if (name == "anonymous") {
    req.flash("error", "Some ERROR Occured");
  } else {
    req.flash("success", "User Registered Successfully");
  }

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page", { name: req.session.name });
});
// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`you sent a request ${req.session.count} times`);
// });

app.listen(port, (req, res) => {
  console.log("server is listening to port 3000");
});
