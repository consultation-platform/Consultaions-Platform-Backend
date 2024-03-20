const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const { uploadSingleImage } = require("../middlewares/uploadImages");
const Course = require("../models/course.model");
const factory = require("./handlers.factory");
const { subscribed } = require("../middlewares/subscribers");
const Mentor = require("../models/mentor.model");

exports.uploadCourseImage = uploadSingleImage("image");

exports.createCourse = async (req, res) => {
  try {
    const document = new Course(req.body);
    document.owner = req.user.id;
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
asyncHandler(async (req, res) => {
  try {
    const document = new Model(req.body);
    await document.save();
    res.status(201).json({ message: "created successfully", document });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const document = await Course.findById(req.params.id).populate({
    path: "videos",
    select: "title , url",
  });
  if (!document)
    return next(
      new ApiError(`the Document  for this id ${req.params.id} not found `, 404)
    );
  res.status(200).json(document);
});

exports.getAllCourses = factory.getAll(Course);

exports.checksubscribed = subscribed(Course);
