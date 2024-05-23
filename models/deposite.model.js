const mongoose = require("mongoose");

const depositeRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    equity: {
      required: true,
      type: Number,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const DepositeRequest = mongoose.model("Deposite", depositeRequestSchema);
module.exports = DepositeRequest;
