const mongoose = require("mongoose");

const commentReplySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", 
      required: true,
    },
  },
  { timestamps: true }
);

const CommentReply = mongoose.model("CommentReply", commentReplySchema);

module.exports = CommentReply;
