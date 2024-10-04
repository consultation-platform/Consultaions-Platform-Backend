const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoachProgramSchema = new Schema({
  image: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  price: { type: Number, required: true },
  goalHeader: { type: String },
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
