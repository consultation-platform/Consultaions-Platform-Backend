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

exports.getMentorsBySemester = asyncHandler(async (req, res) => {
  try {
    if(!req.params.semester){
      return res.status(400).json({message: "Semester parameter is required"});
    }
    const mentors = await Mentor.find({}).select('name email birthdate');
    let filteredMentors = [];

    for (let i = 0; i < mentors.length; i++) {
      const element = mentors[i].birthdate;
      const birthdate = new Date(element);
      const day = birthdate.getDate();
      const month = birthdate.getMonth() + 1;

      if (req.params.semester === 'spring') {
        switch (month) {
          case 3:
            if (day >= 23) {
              filteredMentors.push(mentors[i]);
            }
            break;
          case 4:
          case 5:
          case 6:
            if (day <= 22) {
              filteredMentors.push(mentors[i]);
            }
            break;
        }
      } else if (req.params.semester === 'summer') {
        switch (month) {
          case 6:
            if (day >= 23) {
              filteredMentors.push(mentors[i]);
            }
            break;
          case 7:
          case 8:
          case 9:
            if (day <= 22) {
              filteredMentors.push(mentors[i]);
            }
            break;
        }
      } else if (req.params.semester === 'winter') {
        switch (month) {
          case 12:
            if (day >= 23) {
              filteredMentors.push(mentors[i]);
            }
            break;
          case 1:
          case 2:
          case 3:
            if (day <= 22) {
              filteredMentors.push(mentors[i]);
            }
            break;
        }
      } else if (req.params.semester === 'fall') {
        switch (month) {
          case 9:
            if (day >= 23) {
              filteredMentors.push(mentors[i]);
            }
            break;
          case 10:
          case 11:
          case 12:
            if (day <= 22) {
              filteredMentors.push(mentors[i]);
            }
            break;
        }
      } else {
        return res.status(404).json({ message: 'Invalid semester provided' });
      }
    }

    if (filteredMentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found in the specified date range for the provided semester' });
    }

    res.status(200).json({ message: 'Mentors retrieved successfully', length: filteredMentors.length, mentors: filteredMentors });
    filteredMentors = [];
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Error fetching mentors' });
  }
});

