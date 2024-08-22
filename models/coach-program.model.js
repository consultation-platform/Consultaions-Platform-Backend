const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoachProgramSchema = new Schema({
  paidUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, required: true },
});

const CoachProgram = mongoose.model("CoachProgram", CoachProgramSchema);

module.exports = CoachProgram;
