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
  getAllvideosForPlaylist,
} = require("../services/courses.service");
const { saveSingleImage } = require("../middlewares/imageProcessing");
const { subscribed } = require("../middlewares/subscribers");
const Course = require("../models/course.model");

router.get("/", getAllCourses);

router.post("/", uploadCourseImage, saveSingleImage, createCourse);

router.get("/:id", checksubscribed, getCourseById);
router.get("/videos/:id", checksubscribed, getAllvideosForPlaylist);

router.put("/:id", uploadCourseImage, updateCourse);

router.delete("/:id", deleteCourse);

module.exports = router;
