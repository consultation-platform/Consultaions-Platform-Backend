const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const { uploadSingleImage } = require("../middlewares/uploadImages");
const Course = require("../models/course.model");
const factory = require("./handlers.factory");
const { subscribed } = require("../middlewares/subscribers");
const Video = require("../models/video.model");

exports.uploadCourseImage = uploadSingleImage("image");

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseById = factory.getOne(Course);

exports.getAllvideosForPlaylist = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the playlist exists
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Fetch all videos for the specified playlist
    const videos = await Video.find({ playlist: id });

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.getAllCourses = factory.getAll(Course);

exports.checksubscribed = subscribed(Course);
