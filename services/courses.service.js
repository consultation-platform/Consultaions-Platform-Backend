const { uploadSingleImage } = require("../middlewares/uploadImages");
const Course = require("../models/course.model");
const factory = require("./handlers.factory");
const { subscribed } = require("../middlewares/subscribers");

exports.uploadCourseImage = uploadSingleImage("image");

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseById = factory.getOne(Course);

exports.getAllCourses = factory.getAll(Course);

exports.checksubscribed = subscribed(Course);
