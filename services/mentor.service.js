const Mentor = require("../models/mentor.model");
const factory = require("./handlers.factory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");

exports.unActivateMentor = asyncHandler(async (req, res, next) => {
  const document = await Mentor.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(201).json({ data: document });
});
exports.acceptmentor = asyncHandler(async (req, res, next) => {
  const document = await Mentor.findByIdAndUpdate(
    req.params.id,
    {
      active: false,
    },
    {
      accepted: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(201).json({ data: document });
});
exports.getMentorById = factory.getOne(Mentor);

exports.getAllActiveMentors = asyncHandler(async (req, res, next) => {
  const document = await Mentor.find({ accepted: true });
  if (!document) next(new ApiError(`Error Happend `, 404));
  if (document.length === 0) {
    res.status(201).json({ message: "There Is NO Data To Retrive" });
  } else {
    res.status(200).json({
      message: "Documents retrieved successfully",
      length: document.length,
      document,
    });
  }
});

exports.getAllNotActiveMentors = asyncHandler(async (req, res, next) => {
  const document = await Mentor.find({ accepted: false });
  if (!document) next(new ApiError(`Error Happend `, 404));
  if (document.length === 0) {
    res.status(201).json({ message: "There Is NO Data To Retrive" });
  } else {
    res.status(200).json({
      message: "Documents retrieved successfully",
      length: document.length,
      document,
    });
  }
});
