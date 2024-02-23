const express = require("express");
const router = express.Router();

const {
  getUser,
  getLoggedUserData,
  updateLoggedUserData,
} = require("../services/user.service");

const {
  updateLoggedUserValidator,
} = require("../utils/validations/user.validations");
const { allowedTo, protect } = require("../services/auth.service");
router.use(protect);

router.get("/me", getLoggedUserData, getUser);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

module.exports = router;
