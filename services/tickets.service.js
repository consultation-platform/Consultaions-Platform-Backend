const asyncHandler = require("express-async-handler");
const factory = require("./handlers.factory");
const ConsultationTicket = require("../models/consultation.model");
const ApiError = require("../utils/api.error");
const ConsultationRequest = require("../models/consultaion.payment.record");
const Payments = require("../models/payment.records");
const { generatePaymentSession, paymentCheckout } = require("../utils/payment");
const Mentor = require("../models/mentor.model");

exports.createTicket = asyncHandler(async (req, res) => {
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
    let filterObject = {
      isActive: true,
    };
    if (req.query.field) {
      filterObject = {
        field: req.query.field,
        isActive: true,
      };
    }
    if (req.query.field === "selectAll") {
      filterObject = {
        isActive: true,
      };
    }
    const tickets = await ConsultationTicket.find(filterObject);

    // Return tickets
    res.status(200).json({ length: tickets.length, data: tickets });
  } catch (error) {
    // Handle other errors
    return next(new ApiError(`Error retrieving tickets: ${error.message}`));
  }
});

exports.getAllTicketsForMentor = asyncHandler(async (req, res, next) => {
  const tickets = await ConsultationTicket.find({
    owner: req.params.mentor,
  });
  if (!tickets) {
    return next(
      new ApiError(
        `The tickets for this mentor ${req.params.mentor} were not found`
      )
    );
  }
  res.status(200).json({ length: tickets.length, data: tickets });
});

exports.getLoggedMentorTickets = asyncHandler(async (req, res, next) => {
  const tickets = await ConsultationTicket.find({
    owner: req.user.id,
    isActive: true,
  });
  if (!tickets) {
    return next(
      new ApiError(`The tickets for this mentor ${req.user.id} were not found`)
    );
  }
  res.status(200).json({ length: tickets.length, data: tickets });
});

exports.getAllConsultRequests = asyncHandler(async (req, res, next) => {
  try {
    const consultRequest = await ConsultationRequest.find().populate({
      path: "user ticket",
      select: "title name -_id",
    });
    if (!consultRequest) {
      return next(new ApiError(`The consultation requests were not found`));
    }
    res
      .status(200)
      .json({ length: consultRequest.length, data: consultRequest });
  } catch (error) {
    // Handle other errors
    return next(
      new ApiError(`Error retrieving consultation requests: ${error.message}`)
    );
  }
});

exports.getConsultRequestById = asyncHandler(async (req, res, next) => {
  try {
    const consultRequest = await ConsultationRequest.findById(
      req.params.id
    ).populate({
      path: "user ticket mentor",
      select:
        "title name phone email price day field owner price birthdate owner",
    });
    if (!consultRequest) {
      return next(
        new ApiError(
          `The consultation request with ID ${req.params.id} does not exist`
        )
      );
    }
    res
      .status(200)
      .json({ length: consultRequest.length, data: consultRequest });
  } catch (error) {
    // Handle other errors
    return next(
      new ApiError(`Error retrieving consultation request: ${error.message}`)
    );
  }
});

exports.getLoggedMentorRequests = asyncHandler(async (req, res, next) => {
  const request = await ConsultationRequest.find({
    mentor: req.user.id,
  }).populate({
    path: "user ticket",
    select:
      "title name phone email price phone day owner price birthdate owner",
  });
  if (!request) {
    return next(
      new ApiError(
        `The consultaion requests for this mentor ${req.user.id} were not found`
      )
    );
  }
  res.status(200).json({ length: request.length, data: request });
});

exports.deleteConsultRequestById = factory.deleteOne(ConsultationRequest);

exports.consultaionPaymentSession = async (req, res, next) => {
  try {
    const consultaion = await ConsultationTicket.findById(req.params.id);
    if (!consultaion) {
      return next(
        new ApiError(`The consultaion with ID ${req.params.id} does not exist`)
      );
    }
    const data = {
      success_url: process.env.success_consultaion_url,
      back_url: process.env.fail_payment_url,
      amount: consultaion.price * 100,
      currency: "SAR",
      description: `Cousultation Payment from ${req.user.name}`,
      metadata: {
        ticket: req.params.id,
      },
    };

    const response = await generatePaymentSession(data);
    res
      .status(201)
      .json({ message: "created successfully", data: response.data });
  } catch (error) {
    console.error(
      "Error creating invoice:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.consultationCheckout = async (req, res) => {
  try {
    const response = await paymentCheckout(req.params.id);

    if (response.data.status === "paid") {
      const payment = await Payments.findOne({ refId: response.data.id });
      if (payment) {
        return res.status(401).json({ message: "Expired payment token" });
      }
      const paymentid = new Payments({
        refId: response.data.id,
      });
      await paymentid.save();

      const consultation = await ConsultationTicket.findByIdAndUpdate(
        response.data.metadata.ticket,
        { $push: { paidUsers: req.user.id }, isActive: false },
        { new: true }
      );

      const mentor = await Mentor.findById(consultation.owner);
      const { fees } = mentor;
      let amount = response.data.amount / 100;
      amount = amount - amount * (fees / 100);

      await Mentor.findByIdAndUpdate(
        consultation.owner,
        {
          $push: { paidConsultations: consultation._id },
          $inc: { balance: amount },
        },
        { new: true }
      );

      const consultRequest = new ConsultationRequest({
        user: req.user,
        ticket: response.data.metadata.ticket,
        mentor: mentor,
        status: response.data.status,
        amount: response.data.amount / 100,
        invoice_id: req.params.id,
        type:
          (response.data.payments &&
            response.data.payments[0].source &&
            response.data.payments[0].source.type) ||
          null,
        company:
          (response.data.payments &&
            response.data.payments[0].source &&
            response.data.payments[0].source.company) ||
          null,
        paidOn: Date.now(),
      });
      await consultRequest.save();
    } else {
      console.error("Payment failed for invoice ID:", req.params.id);
      return res.status(400).json({ message: "Payment failed" });
    }
    res.status(200).json({ message: "Paid successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Error processing payment" });
  }
};
