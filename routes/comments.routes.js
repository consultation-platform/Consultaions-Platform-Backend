const express = require("express");
const router = express.Router();
const {
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
} = require("../services/comments.service");
const { checkCommentOwner } = require("../middlewares/check.comment.owner");
const { allowedTo, protect } = require("../services/auth.service");

// Create comment
router.post(
  "/:id",
  protect,
  //   allowedTo("user", "manager", "admin"),
  createComment
);

// Read all comments
router.get("/:id", getAllComments);

// Update Comment
router.put(
  "/:id",
  protect,
  //   allowedTo("user", "manager", "admin"),
  checkCommentOwner,
  updateComment
);

// Delete comment by ID
router.delete(
  "/:id",
  protect,
  //   allowedTo("user", "manager", "admin"),
  checkCommentOwner,
  deleteComment
);

module.exports = router;
