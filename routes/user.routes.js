const express = require("express");
const { signup, login } = require("../services/auth.service");
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);

module.exports = router;
