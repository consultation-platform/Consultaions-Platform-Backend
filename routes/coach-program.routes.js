const express = require("express");
const router = express.Router();
const { protect, allowedTo } = require("../services/auth.service");
const {
  coachProgramPaymentSession,
  coachProgramcheckoutPayment,
} = require("../services/coachProgram.service");

router.post("/payment/:id", protect, coachProgramPaymentSession);

router.post("/checkout/:id", protect, coachProgramcheckoutPayment);

module.exports = router;
