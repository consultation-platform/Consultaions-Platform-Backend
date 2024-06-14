const factory = require("./handlers.factory");
const Cover = require("../models/cover.model");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");

const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.uploadCoverImage = uploadSingleImage("image");

exports.createCover = factory.createOne(Cover);

exports.deleteCover = factory.deleteOne(Cover);

exports.getCoverById = factory.getOne(Cover);

exports.updateCover = factory.updateOne(Cover);

exports.getAllCovers = asyncHandler(async (req, res, next) => {
  const document = await Cover.find().select("title image description  name");
  if (!document) next(new ApiError(`Error Happend `, 404));
  if (document.length === 0) {
    res.status(200).json({ message: "There Is NO Data To Retrive" });
  } else {
    res.status(200).json({
      message: "Documents retrieved successfully",
      length: document.length,
      document,
    });
  }
});
