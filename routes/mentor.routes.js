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
} = require("../services/mentor.service");

router.get("/not-active", getAllNotActiveMentors);
router.post("/unactivate/:id", unActivateMentor);
router.post("/accept/:id", acceptmentor);
router.get("/active", getAllActiveMentors);
router.get("/field", getMentorsByField);
router.get("/semester", getMentorsBySemester);
router.get("/:id", getMentorById);

module.exports = router;
