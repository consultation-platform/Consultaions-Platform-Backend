const HonorBoard = require("../models/honor.board.model");
const factory = require("./handlers.factory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
exports.createHonorBoardItem = factory.createOne(HonorBoard);

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
