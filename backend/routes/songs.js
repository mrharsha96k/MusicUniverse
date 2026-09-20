const express = require("express");

const router = express.Router();

const { getSongs } = require("../controllers/songsController");

router.get("/", getSongs);

module.exports = router;