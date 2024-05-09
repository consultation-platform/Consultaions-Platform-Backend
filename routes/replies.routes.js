const express = require("express");
const router = express.Router();
const {
  createReply,
  updateReply,
  deleteReply,
  getAllReplies,
} = require("../services/replies.service");
const { protect, allowedTo } = require("../services/auth.service");
const { checkReplyOwner } = require("../middlewares/check.reply.owner");
// Create comment reply
router.post("/:id", protect, createReply);

// Update comment reply by ID
router.put(
  "/:id",
  protect,
  //   allowedTo("user", "manager"),
  checkReplyOwner,
  updateReply
);

// Delete comment reply by ID
router.delete(
  "/:id",
  protect,
  //   allowedTo("user", "manager"),
  checkReplyOwner,
  deleteReply
);

// Get all replies for a comment
router.get("/comment/:id", getAllReplies);

module.exports = router;
