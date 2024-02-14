const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resendVerificationCode,
  verifyPassResetCode,
  resetPassword,
  logout,
} = require("../services/auth.service");

const {
  signupValidator,
  loginValidator,
  resetePasswordValidator,
} = require("../utils/validations/auth.validations");

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyPassResetCode);
router.put("/reset-password", resetePasswordValidator, resetPassword);
router.post("/logout", logout);

module.exports = router;
