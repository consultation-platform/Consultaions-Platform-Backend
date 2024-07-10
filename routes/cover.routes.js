const express = require("express");
const router = express.Router();

const {
  createCover,
  getAllCovers,
  updateCover,
  uploadCoverImage,
} = require("../services/cover.service");

const { allowedTo, protect } = require("../services/auth.service");
const { saveFilesNameToDB } = require("../middlewares/imagesAndFilesProcess");

// Create a new cover
router.post(
  "/",
  protect,
  allowedTo("manager", "admin"),
  uploadCoverImage,
  saveFilesNameToDB,
  createCover
);

// Get all covers
router.get("/", getAllCovers);

// Update cover by id
router.put(
  "/:id",
//   protect,
//   allowedTo("manager", "admin"),
  uploadCoverImage,
  saveFilesNameToDB,
  updateCover
);

module.exports = router;
