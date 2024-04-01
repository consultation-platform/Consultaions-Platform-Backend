const express = require("express");
const router = express.Router();
const {
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
  getCommentByID,
} = require("../services/comments.service");
const { checkCommentOwner } = require("../middlewares/check.comment.owner");
const { allowedTo, protect } = require("../services/auth.service");

// Create comment
router.post(
  "/:id",
  protect,
  createComment
);

// Read all comments
router.get("/course/:id", getAllComments);
router.get("/:id", getCommentByID);

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
