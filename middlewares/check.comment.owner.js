const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const Comment = require("../models/comments.model");

exports.checkCommentOwner = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new ApiError(`The comment with ID ${req.params.id} does not exist`)
    );
  }

  if (comment.owner.toString() !== req.user.id && req.user.role !== "manager") {
    return next(new ApiError(`You are not the owner of this comment`));
  }

  next();
});
