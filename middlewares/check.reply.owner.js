const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const CommentReply = require("../models/replies.model");

exports.checkReplyOwner = asyncHandler(async (req, res, next) => {
  const commentReply = await CommentReply.findById(req.params.id);
  if (!commentReply) {
    return next(
      new ApiError(`The commentReply with ID ${req.params.id} does not exist`)
    );
  }

  if (
    commentReply.owner.toString() !== req.user.id &&
    req.user.role !== "manager"
  ) {
    return next(new ApiError(`You are not the owner of this commentReply`));
  }

  next();
});
