const express = require("express");
const router = express.Router();

//Index
router.get("/", (req, res) => {
  res.send("GET for users");
});
router.get("/:id", (req, res) => {
  res.send("GET for usersss");
});
router.post("/", (req, res) => {
  res.send("GET for sersss");
});

//Delete
router.delete("/:id", (req, res) => {
  res.send("Delete for user id");
});

module.exports = router;
