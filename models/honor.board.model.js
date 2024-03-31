const mongoose = require("mongoose");

const { Schema } = mongoose;

const honorBoardSchema = new Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },
});

const HonorBoard = mongoose.model("HonorBoard", honorBoardSchema);
module.exports = HonorBoard;
