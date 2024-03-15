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

router.get("/", getAllCourses);

router.post("/", uploadCourseImage, saveSingleImage, createCourse);

router.get("/:id", getCourseById);
 
router.put("/:id", uploadCourseImage, updateCourse);

router.delete("/:id", deleteCourse);

module.exports = router;
