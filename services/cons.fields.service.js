const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const User = require("../models/user.model");

const Consulting_fields = require("../models/cons.fields.model");
const factory = require("./handlers.factory");

exports.createField = asyncHandler(async (req, res) => {
  try {
    const existingDocument = await Consulting_fields.findOne({
      field: req.body.field,
    });
    if (existingDocument) {
      return res.status(400).json({ error: "Field already exists" });
    }
    const document = new Consulting_fields(req.body);
    await document.save();
    res.status(201).json({ message: "Created successfully", document });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.updateField = factory.updateOne(Consulting_fields);
exports.deleteField = factory.deleteOne(Consulting_fields);
exports.getAllFiedls = asyncHandler(async (req, res, next) => {
  const document = await Consulting_fields.find();
  if (!document) next(new ApiError(`Error Happend `, 404));
  if (document.length === 0) {
    res.status(200).json({ message: "There Is NO Data To Retrive" });
  } else {
    res.status(200).json({
      message: "Documents retrieved successfully",
      length: document.length,
      document,
    });
  }
});
