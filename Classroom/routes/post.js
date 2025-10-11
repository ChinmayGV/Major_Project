const express = require("express");
const router = express.Router();

//Index
router.get("/", (req, res) => {
  res.send("GET for posts");
});
router.get("/:id", (req, res) => {
  res.send("GET for posts");
});
router.post("/", (req, res) => {
  res.send("GET for posts");
});

//Delete
router.delete("/:id", (req, res) => {
  res.send("Delete for post id");
});

module.exports = router;
