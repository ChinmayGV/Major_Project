const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("terms&policy/t&c.ejs");
});

module.exports = router;
