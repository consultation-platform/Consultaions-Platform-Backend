const express = require("express");
const router = express.Router();

const {             
    createCover,
    getAllCovers,
    updateCover,
    uploadCoverImage
} = require("../services/cover.service");
const { saveSingleImage } = require("../middlewares/imageProcessing");

const { allowedTo, protect } = require("../services/auth.service");

// Create a new cover
router.post("/",
 protect, allowedTo("manager", "admin"), 
 uploadCoverImage,saveSingleImage,createCover);

// Get all covers
router.get("/", getAllCovers);

// Update cover by id
router.put(
    "/:id",
    protect,
    allowedTo("manager", "admin"),
    uploadCoverImage,saveSingleImage,
    updateCover
);

module.exports = router;
