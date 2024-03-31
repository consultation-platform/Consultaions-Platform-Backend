const Comment = require("../models/comments.model");
const asyncHandler = require("express-async-handler");

exports.createComment = asyncHandler(async (req, res, next) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      owner: req.user.id,
      course: req.params.id,
    });
    await comment.save();
    res.status(201).json({ message: "created successfully", comment });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    if (!comment)
      return next(
        new ApiError(
          `the Comment  for this id ${req.params.id} not found `,
          404
        )
      );
    res.status(201).json({ message: "created successfully", comment });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return next(
        new ApiError(
          `the Comment  for this id ${req.params.id} not found `,
          404
        )
      );
    res.status(201).json({ message: "deleted successfully", comment });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.getAllComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({
    course: req.params.id,
  });
  if (!comments) {
    return next(
      new ApiError(
        `The comments for this course ${req.params.id} were not found`
      )
    );
  }
  res.status(200).json({ length: comments.length, data: comments });
});
