const Mentor = require("../models/mentor.model");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const DepositeRequest = require("../models/deposite.model");

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
    { accepted: true, fees: req.body.fees },
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
    "name phone email field  accepted image courses"
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
    let filterObject = {};
    if (req.query.field) {
      filterObject.field = req.query.field;
    }
    if (req.query.field === "selectAll") {
      filterObject = {};
    }
    const mentors = await Mentor.find(filterObject).select(
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
    const validSemesters = ["winter", "summer", "spring", "fall"];

    if (!req.params.semester || !validSemesters.includes(req.params.semester)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing semester parameter" });
    }

    const mentors = await Mentor.find({}).select("name email image birthdate");
    let filteredMentors = [];

    for (const mentor of mentors) {
      const birthdate = new Date(mentor.birthdate);
      const month = birthdate.getMonth() + 1;
      const day = birthdate.getDate();

      switch (req.params.semester) {
        case "spring":
          if (
            (month === 3 && day >= 23) ||
            (month >= 4 && month <= 6) ||
            (month === 6 && day <= 22)
          ) {
            filteredMentors.push(mentor);
          }
          break;
        case "summer":
          if (
            (month === 6 && day >= 23) ||
            (month >= 7 && month <= 9) ||
            (month === 9 && day <= 22)
          ) {
            filteredMentors.push(mentor);
          }
          break;
        case "winter":
          if (
            (month === 12 && day >= 23) ||
            (month >= 1 && month <= 3) ||
            (month === 3 && day <= 22)
          ) {
            filteredMentors.push(mentor);
          }
          break;
        case "fall":
          if (
            (month === 9 && day >= 23) ||
            (month >= 10 && month <= 11) ||
            (month === 12 && day <= 22)
          ) {
            filteredMentors.push(mentor);
          }
          break;
        default:
          return res.status(400).json({ message: "Invalid semester provided" });
      }
    }

    if (filteredMentors.length === 0) {
      return res.status(404).json({
        message:
          "No mentors found in the specified date range for the provided semester",
      });
    }

    res.status(200).json({
      message: "Mentors retrieved successfully",
      length: filteredMentors.length,
      mentors: filteredMentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ message: "Error fetching mentors" });
  }
});

exports.depositeRequest = asyncHandler(async (req, res, next) => {
  const { equity } = req.body;
  if (req.user.balance < equity) {
    return next(
      new ApiError(
        `insufficient balance , your current balance is${req.user.balance}`,
        401
      )
    );
  }
  const depositeRequest = new DepositeRequest({
    mentor: req.user,
    equity: equity,
  });
  await depositeRequest.save();

  res.status(200).json({
    message: `Deposite request saved successfully`,
    depositeRequest: depositeRequest,
  });
});

exports.getAcceptedDepostes = asyncHandler(async (req, res) => {
  const accepted = await DepositeRequest.find({ accepted: true });
  res.status(200).json({ data: accepted });
});

exports.getNotAcceptedDepostes = asyncHandler(async (req, res) => {
  const notAccepted = await DepositeRequest.find({ accepted: false });
  res.status(200).json({ data: notAccepted });
});
exports.getDeposteRequestByID = asyncHandler(async (req, res) => {
  const deposteRequest = await DepositeRequest.findById(req.params.id).populate(
    {
      path: "mentor",
      select: "name email address email phone balance fees socilaMedia ",
    }
  );
  if (!deposteRequest) {
    return next(
      new ApiError(`No deposteRequest found for ID ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: deposteRequest });
});

exports.acceptDepositRequest = asyncHandler(async (req, res, next) => {
  const depositRequest = await DepositeRequest.findByIdAndUpdate(
    req.params.id,
    { accepted: true },
    { new: true }
  );
  if (!depositRequest) {
    return next(
      new ApiError(`No deposit request found for ID ${req.params.id}`, 404)
    );
  }

  const mentor = await Mentor.findById(depositRequest.mentor);
  if (!mentor) {
    return next(
      new ApiError(`No mentor found for ID ${depositRequest.mentor}`, 404)
    );
  }

  mentor.balance = mentor.balance - depositRequest.equity;
  await mentor.save();

  res.status(200).json({ data: depositRequest, mentorBalance: mentor.balance });
});
