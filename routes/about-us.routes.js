const express = require("express");
const { getAll, update, create } = require("../services/about-us.service");
const { protect, allowedTo } = require("../services/auth.service");
const router = express.Router();

// create routes
router.post("/", protect, allowedTo("manager"), create);

// get all routes
router.get("/", getAll);

// update routes
router.put("/:id", protect, allowedTo("manager"), update);

module.exports = router;
