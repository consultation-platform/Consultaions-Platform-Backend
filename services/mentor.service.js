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
    "name phone email field active"
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

    // Check if the semester parameter is provided
    if (!semester) {
      return res
        .status(400)
        .json({ message: "Semester parameter is required" });
    }

    // Define the start and end dates for the semester (assuming a standard academic year)
    let startDate, endDate;

    if (semester === "fall") {
      startDate = new Date(`${new Date().getFullYear()}-09-01`);
      endDate = new Date(`${new Date().getFullYear()}-12-31`);
    } else if (semester === "spring") {
      startDate = new Date(`${new Date().getFullYear()}-01-01`);
      endDate = new Date(`${new Date().getFullYear()}-05-31`);
    } else if (semester === "summer") {
      startDate = new Date(`${new Date().getFullYear()}-06-01`);
      endDate = new Date(`${new Date().getFullYear()}-08-31`);
    } else if (semester === "winter") {
      startDate = new Date(`${new Date().getFullYear()}-01-01`);
      endDate = new Date(`${new Date().getFullYear()}-02-28`);
    } else {
      return res.status(400).json({ message: "Invalid semester parameter" });
    }

    // Find mentors and calculate the semester dynamically based on birthdate
    const mentors = await Mentor.find()
      .lean()
      .select("name phone email field image");

    // Filter mentors based on birthdate semester
    const mentorsInSemester = mentors.filter((mentor) => {
      const birthdate = new Date(mentor.birthdate);
      return birthdate >= startDate && birthdate <= endDate;
    });

    if (!mentorsInSemester || mentorsInSemester.length === 0) {
      return res
        .status(404)
        .json({ message: `No mentors found for semester '${semester}'` });
    }

    res
      .status(200)
      .json({ length: mentorsInSemester.length, mentors: mentorsInSemester });
  } catch (error) {
    console.error("Error retrieving mentors by semester:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
