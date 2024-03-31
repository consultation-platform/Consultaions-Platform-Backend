const HonorBoard = require("../models/honor.board.model");
const factory = require("./handlers.factory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const Mentor = require("../models/mentor.model");
exports.createHonorBoardItem = asyncHandler(async (req, res) => {
  try {
    // Check if mentor with provided ID exists
    const mentor = await Mentor.findById(req.body.mentor);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found for this id " });
    }

    // If mentor exists, proceed to create the honor board item
    const document = new Mentor(req.body);
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

exports.deleteHonorBoardItem = factory.deleteOne(HonorBoard);

exports.getAllHonorBoardItems = asyncHandler(async (req, res, next) => {
  try {
    const documents = await HonorBoard.find({}).populate({
      path: "mentor",
      select: "name image field",
    });

    if (documents.length === 0) {
      return res.status(200).json({ message: "There Is NO Data To Retrieve" });
    }

    res.status(200).json({
      message: "Documents retrieved successfully",
      length: documents.length,
      documents,
    });
  } catch (error) {
    next(new ApiError(`Error Happened: ${error.message}`, 500));
  }
});

exports.updateHonorBoardItem = factory.updateOne(HonorBoard);
