const express = require("express");
const router = express.Router();
const { protect, allowedTo } = require("../services/auth.service");
const {
  coachProgramPaymentSession,
  coachProgramcheckoutPayment,
  getProgramInfo,
  updateProgramInfo,
  uploadCoachMedia,
} = require("../services/coachProgram.service");
const { saveFilesNameToDB } = require("../middlewares/imagesAndFilesProcess");

router.get("/:id", getProgramInfo);

router.put(
  "/:id",
  //  protect, allowedTo("manager", "admin"),
  uploadCoachMedia,
  saveFilesNameToDB,
  updateProgramInfo
);

router.post("/payment/:id", protect, coachProgramPaymentSession);

router.post("/checkout/:id", protect, coachProgramcheckoutPayment);

module.exports = router;
