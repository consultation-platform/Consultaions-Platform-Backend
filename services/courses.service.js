const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const { uploadSingleImage } = require("../middlewares/uploadImages");
const Course = require("../models/course.model");
const factory = require("./handlers.factory");

exports.uploadCourseImage = uploadSingleImage("image");

exports.createCourse = async (req, res) => {
  try {
    const document = new Course(req.body);
    document.owner = req.user.id;
    document.field = req.user.field;
    await document.save();
    res.status(201).json({ message: "created successfully", document });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
};
exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const document = await Course.findById(req.params.id).populate({
    path: "videos",
    select: "title description url",
  });
  if (!document)
    return next(
      new ApiError(`the Document  for this id ${req.params.id} not found `, 404)
    );
  res.status(200).json(document);
});

exports.getAllCourses = factory.getAll(Course);

exports.getLoggedMentorCourses = asyncHandler(async (req, res, next) => {
  const course = await Course.find({
    owner: req.user.id,
  });
  if (!course) {
    return next(
      new ApiError(`The course for this mentor ${req.user.id} were not found`)
    );
  }
  res.status(200).json({ length: course.length, data: course });
});

exports.getAllCoursesForField = asyncHandler(async (req, res, next) => {
  try {
    const courses = await Course.find({
      field: req.params.field,
    });

    // Check if courses array is empty
    if (courses.length === 0) {
      return next(
        new ApiError(`No courses found for field ${req.params.field}`)
      );
    }

    // Return courses
    res.status(200).json({ length: courses.length, data: courses });
  } catch (error) {
    // Handle other errors
    return next(new ApiError(`Error retrieving courses: ${error.message}`));
  }
});

exports.getAllCoursesForMentor = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    mentor: req.params.mentor,
    isActive: true,
  });
  if (!courses) {
    return next(
      new ApiError(
        `The courses for this mentor ${req.params.mentor} were not found`
      )
    );
  }
  res.status(200).json({ length: courses.length, data: courses });
});
