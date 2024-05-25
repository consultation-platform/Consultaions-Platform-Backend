const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    text1: {
      type: String,
      required: true,
    },
    text2: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
