const express = require("express");
const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("This is a Test.")
})


router.get("/test", (req, res, next) => {
  res.send("Welcome to LA Hacks!")
})

module.exports = router;
