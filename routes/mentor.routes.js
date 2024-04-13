const express = require("express");
const router = express.Router();

const {
  unActivateMentor,
  acceptmentor,
  getMentorById,
  getAllActiveMentors,
  getAllNotActiveMentors,
  getMentorsByField,
  getMentorsBySemester,
  getMentorsByBirthdate,
} = require("../services/mentor.service");
const { allowedTo, protect } = require("../services/auth.service");

router.get(
  "/not-active",
  protect,
  allowedTo("manager", "admin"),
  getAllNotActiveMentors
);
router.post(
  "/unactivate/:id",
  protect,
  allowedTo("manager", "admin"),
  unActivateMentor
);
router.post(
  "/accept/:id",
  protect,
  allowedTo("manager", "admin"),
  acceptmentor
);
router.get("/active", getAllActiveMentors);
router.get("/field", getMentorsByField);
router.get("/semester/:semester", getMentorsBySemester);

router.get("/:id", getMentorById);

module.exports = router;
