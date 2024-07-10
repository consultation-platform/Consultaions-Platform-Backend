const mongoose = require("mongoose");

const coverSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      default: " ",
    },
    thumbnail: {
      type: String,
      default: " ",
    },
  },
  { timestamps: true }
);

const Cover = mongoose.model("Cover", coverSchema);

module.exports = Cover;
