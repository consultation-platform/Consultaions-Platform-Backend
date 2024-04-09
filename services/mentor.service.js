const Mentor = require("../models/mentor.model");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");

exports.unActivateMentor = asyncHandler(async (req, res, next) => {
  const mentor = await Mentor.findByIdAndUpdate(
    req.params.id,
    { accepted: false },
    { new: true }
  );

  if (!mentor) {
    return next(new ApiError(`No mentor found for ID ${req.params.id}`, 404));
  }
  res.status(200).json({ data: mentor });
});

exports.acceptmentor = asyncHandler(async (req, res, next) => {
  const mentor = await Mentor.findByIdAndUpdate(
    req.params.id,
    { accepted: true },
    { new: true }
  );

  if (!mentor) {
    return next(new ApiError(`No mentor found for ID ${req.params.id}`, 404));
  }
  res.status(200).json({ data: mentor });
});

exports.getMentorById = asyncHandler(async (req, res, next) => {
  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) {
    return next(new ApiError(`No mentor found for ID ${req.params.id}`, 404));
  }
  res.status(200).json({ data: mentor });
});

exports.getAllActiveMentors = asyncHandler(async (req, res, next) => {
  const mentors = await Mentor.find({ accepted: true }).select(
    "name phone email field  accepted"
  );

  if (mentors.length === 0) {
    return res.status(404).json({ message: "No active mentors found." });
  }

  res.status(200).json({
    message: "Active mentors retrieved successfully",
    length: mentors.length,
    data: mentors,
  });
});

exports.getAllNotActiveMentors = asyncHandler(async (req, res, next) => {
  const mentors = await Mentor.find({ accepted: false }).select(
    "name phone email field active"
  );

  if (mentors.length === 0) {
    return res.status(404).json({ message: "No not active mentors found." });
  }

  res.status(200).json({
    message: "Not active mentors retrieved successfully",
    length: mentors.length,
    data: mentors,
  });
});

exports.getMentorsByField = async (req, res, next) => {
  try {
    // Extract the field value from the query parameters
    const field = req.query.field;

    // Check if the field parameter is provided
    if (!field) {
      return res.status(400).json({ message: "Field parameter is required" });
    }

    // Find mentors by the provided field
    const mentors = await Mentor.find({ field }).select(
      "name phone email field image"
    );

    if (!mentors || mentors.length === 0) {
      return res
        .status(404)
        .json({ message: `No mentors found for field '${field}'` });
    }

    res.status(200).json({ mentors });
  } catch (error) {
    console.error("Error retrieving mentors by field:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMentorsBySemester = async (req, res, next) => {
  try {
    // Extract the semester value from the query parameters
    const semester = req.query.semester;

    // Check if the semester parameter is provided and valid
    if (!semester || !['spring', 'fall', 'winter', 'summer'].includes(semester)) {
      return res.status(400).json({ message: "Invalid or missing semester parameter" });
    }

    // Define the start and end dates for the semester
    let startDate, endDate;

    const currentYear = new Date().getFullYear();

    if (semester === "fall") {
      startDate = new Date(`${currentYear}-09-23`);
      endDate = new Date(`${currentYear}-12-31`);
    } else if (semester === "spring") {
      startDate = new Date(`${currentYear}-03-21`);
      endDate = new Date(`${currentYear}-05-31`);
    } else if (semester === "summer") {
      startDate = new Date(`${currentYear}-06-21`);
      endDate = new Date(`${currentYear}-08-31`);
    } else if (semester === "winter") {
      startDate = new Date(`${currentYear}-12-22`);
      endDate = new Date(`${currentYear + 1}-02-28`);
    }

    console.log(`Start date for ${semester}: ${startDate}`);
    console.log(`End date for ${semester}: ${endDate}`);

    // Find mentors with birthdates within the semester
    const mentors = await Mentor.find({
      birthdate: {
        $gte: startDate,
        $lte: endDate
      }
    }).lean().select("name phone email field image");

    console.log(`Number of mentors found for ${semester}: ${mentors.length}`);

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: `No mentors found for semester '${semester}'` });
    }

    res.status(200).json({ length: mentors.length, mentors: mentors });
  } catch (error) {
    console.error("Error retrieving mentors by semester:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
