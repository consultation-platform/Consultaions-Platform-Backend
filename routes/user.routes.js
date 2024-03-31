const express = require("express");
const router = express.Router();

const {
  getUser,
  getLoggedUserData,
  updateLoggedUserData,
  getUsers,
  updateLoggedUserPassword,
  updateUserRole,
} = require("../services/user.service");

// const {} = require("../utils/validations/user.validations");
const { allowedTo, protect } = require("../services/auth.service");
router.use(protect);

router.get("/", getUsers);
router.get("/me", getLoggedUserData);
router.put("/updateMe", updateLoggedUserData);
router.put("/update-password", updateLoggedUserPassword);
router.put("/update-role", updateUserRole);

module.exports = router;
