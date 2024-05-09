const express = require("express");
const { getAll, update, create } = require("../services/about-us.service");
const { protect } = require("../services/auth.service");
const router = express.Router();

// create routes
router.post("/", protect, create);

// get all routes
router.get("/", protect, getAll);

// update routes
router.put("/:id", protect, update);

module.exports = router;
