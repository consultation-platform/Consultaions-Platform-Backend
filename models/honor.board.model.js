const mongoose = require("mongoose");

const { Schema } = mongoose;

const honorBoardSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  profileLink: {
    type: String,
    required: true,
  },
});

const HonorBoard = mongoose.model("HonorBoard", honorBoardSchema);
module.exports = HonorBoard;
