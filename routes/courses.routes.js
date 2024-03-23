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
  getAllCoursesForField,
  getAllCoursesForMentor,
  getLoggedMentorCourses,
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
} = require("../services/courses.service");
const { saveSingleImage } = require("../middlewares/imageProcessing");
const { protect, allowedTo } = require("../services/auth.service");
const { checkOwner } = require("../middlewares/check.owner");
const { checkCommentOwner } = require("../middlewares/check.comment.owner");

router.get("/", getAllCourses);

router.post(
  "/",
  protect,
  allowedTo("mentor", "manager"),
  uploadCourseImage,
  saveSingleImage,
  createCourse
);

// Get all tickets for field
router.get("/field/:field", getAllCoursesForField);

// Get all tickets for mentor
router.get("/mentor/:mentor", getAllCoursesForMentor);

// Get all tickets for logged mentor
router.get("/my-courses", protect, getLoggedMentorCourses);

router.post(
  "/:id/comment",
  protect,
  allowedTo("user", "manager"),
  createComment
);

router.get("/:id/comments", getAllComments);

router.delete(
  "/:id/comment/:id",
  protect,
  allowedTo("user", "manager"),
  checkCommentOwner,
  deleteComment
);

router.put(
  "/:id/comment/:id",
  protect,
  allowedTo("user", "manager"),
  checkCommentOwner,
  updateComment
);

router.get("/:id", getCourseById);

router.put("/:id", protect, checkOwner, uploadCourseImage, updateCourse);

router.delete("/:id", protect, allowedTo("mentor", "manager"), deleteCourse);

module.exports = router;
