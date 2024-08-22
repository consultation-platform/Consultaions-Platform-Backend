const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoachProgramSchema = new Schema({
  paidUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, required: true },
  gloalHeader: { type: String },
  goalDescription: { type: String },
  detailedGoalHeader: { type: String },
  detailedGoalDescription: [{ type: String }],  
  programDetailsHeader: { type: String },
  programDetailsDescription: [{ type: String }], 
  programAspectsHeader: { type: String },
  programAspectsDescription: [{ type: String }],
  benefitsHeader: { type: String },
  benefitsDescription: [{ type: String }],
});

const CoachProgram = mongoose.model("CoachProgram", CoachProgramSchema);

module.exports = CoachProgram;
