const express = require("express");
const app = express();
const port = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/getcookies", (req, res) => {
  res.cookie("greet", "hello");
  res.send("sent cookies check it !");
});
app.get("/", (req, res) => {
  res.send("Hi I am Root");
});

app.use("/users", users);
app.use("/posts", posts);
app.listen(port, (req, res) => {
  console.log("server is listening to port 3000");
});
