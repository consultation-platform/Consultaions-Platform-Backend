const CommentReply = require("../models/replies.model");
const asyncHandler = require("express-async-handler");

exports.createReply = asyncHandler(async (req, res, next) => {
  try {
    const reply = new CommentReply({
      text: req.body.text,
      owner: req.user.id,
      comment: req.params.id,
    });
    await reply.save();
    res.status(201).json({ message: "created successfully", reply });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.updateReply = asyncHandler(async (req, res, next) => {
  try {
    const reply = await CommentReply.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    if (!reply)
      return next(
        new ApiError(`the reply  for this id ${req.params.id} not found `, 404)
      );
    res.status(201).json({ message: "created successfully", reply });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.deleteReply = asyncHandler(async (req, res, next) => {
  try {
    const reply = await CommentReply.findByIdAndDelete(req.params.id);
    if (!reply)
      return next(
        new ApiError(`the reply  for this id ${req.params.id} not found `, 404)
      );
    res.status(201).json({ message: "deleted successfully", reply });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.getAllReplies = asyncHandler(async (req, res, next) => {
  const replies = await CommentReply.find({
    comment: req.params.id,
  });
  if (!replies) {
    return next(
      new ApiError(
        `The replies for this course ${req.params.id} were not found`
      )
    );
  }
  res.status(200).json({ length: replies.length, data: replies });
});
