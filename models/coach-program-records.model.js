const mongoose = require("mongoose");
const { Company } = require("sib-api-v3-sdk");

const CoachProgramSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoachProgram",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userIP: String,
  status: String,
  amount: Number,
  invoice_id: String,
  paidOn: Date,
});

const CoachProgramRequest = mongoose.model("CoachProgramRequest", CoachProgramSchema);

module.exports = CoachProgramRequest;
