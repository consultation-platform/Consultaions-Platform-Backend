const express = require("express");
const router = express.Router();

const {
  getUser,
  getLoggedUserData,
  updateLoggedUserData,
  getUsers,
} = require("../services/user.service");

const {
  updateLoggedUserValidator,
} = require("../utils/validations/user.validations");
const { allowedTo, protect } = require("../services/auth.service");
router.use(protect);

router.get("/", getUsers);
router.get("/me", getLoggedUserData);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

module.exports = router;
