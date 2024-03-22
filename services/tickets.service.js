const asyncHandler = require("express-async-handler");
const factory = require("./handlers.factory");
const ConsultationTicket = require("../models/consultation.model");
const ApiError = require("../utils/api.error");

exports.createTicket = asyncHandler(async (req, res) => {
  console.log(req.user);
  try {
    const document = new ConsultationTicket(req.body);
    document.owner = req.user.id;
    document.field = req.user.field;
    await document.save();
    res.status(201).json({ message: "created successfully", document });
  } catch (error) {
    console.error("Error occurred while creating:", error);
    res.status(500).json({
      error: "Error occurred while creating",
      details: error.message,
    });
  }
});

exports.deleteTicket = factory.deleteOne(ConsultationTicket);

exports.getTicketById = factory.getOne(ConsultationTicket);

exports.getAllTicketsForField = asyncHandler(async (req, res, next) => {
  try {
    const tickets = await ConsultationTicket.find({
      field: req.params.field,
      isActive: true,
    });

    // Check if tickets array is empty
    if (tickets.length === 0) {
      return next(
        new ApiError(`No tickets found for field ${req.params.field}`)
      );
    }

    // Return tickets
    res.status(200).json({ data: tickets, length: tickets.length });
  } catch (error) {
    // Handle other errors
    return next(new ApiError(`Error retrieving tickets: ${error.message}`));
  }
});

exports.getAllTicketsForMentor = asyncHandler(async (req, res, next) => {
  const tickets = await ConsultationTicket.find({
    mentor: req.params.mentor,
    isActive: true,
  });
  if (!tickets) {
    return next(
      new ApiError(
        `The tickets for this mentor ${req.params.mentor} were not found`
      )
    );
  }
  res.status(200).json({ data: tickets, length: tickets.length });
});
