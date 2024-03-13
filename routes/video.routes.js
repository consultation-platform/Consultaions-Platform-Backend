// routes/VideoRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { saveSingleImage } = require("../middlewares/imageProcessing");

const {
  createVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
  getVideoById,
  uploadVideoImage,
} = require("../services/video.service");
// const { allowedTo, protect } = require("../services/authService");

// router.use(protect);
// Route to create a new Video
router.post("/", uploadVideoImage, saveSingleImage, createVideo);

// Route to get a Video by ID
router.get("/:id", getVideoById);

// Route to update a Video
router.put("/:id", updateVideo);

// Route to delete a Video
router.delete("/:id", deleteVideo);

// Export the router
module.exports = router;
