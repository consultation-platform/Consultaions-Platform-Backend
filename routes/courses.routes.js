// routes/CourseRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
  uploadCourseImage,
  checksubscribed,
  getAllvideosForCourses,
} = require("../services/courses.service");
const { saveSingleImage } = require("../middlewares/imageProcessing");
const { subscribed } = require("../middlewares/subscribers");
const { protect, allowedTo } = require("../services/auth.service");
const { checkOwner } = require("../middlewares/check.owner");

router.get("/", getAllCourses);

router.post(
  "/",
  protect,
  allowedTo("mentor", "manager"),
  uploadCourseImage,
  saveSingleImage,
  createCourse
);

router.get("/:id", getCourseById);

router.put("/:id", protect, checkOwner, uploadCourseImage, updateCourse);

router.delete("/:id", protect, allowedTo("mentor", "manager"), deleteCourse);

module.exports = router;
