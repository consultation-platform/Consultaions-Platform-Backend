const CoachProgramRequest = require("../models/coach-program-records.model");
const CoachProgram = require("../models/coach-program.model");
const Payments = require("../models/payment.records");
const ApiError = require("../utils/api.error");
const { generatePaymentSession, paymentCheckout } = require("../utils/payment");
const { getOne, updateOne } = require("./handlers.factory");
const { uploadMixOfImages } = require("../middlewares/uploadImages");

exports.uploadCoachMedia = uploadMixOfImages([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
 ]);

exports.getProgramInfo = getOne(CoachProgram)

exports.updateProgramInfo = updateOne(CoachProgram)

exports.coachProgramPaymentSession = async (req, res, next) => {
  try {
    const coachProgram = await CoachProgram.findById(req.params.id);
    if (!coachProgram) {
      return next(
        new ApiError(`The course with ID ${req.params.id} was not found`, 404)
      );
    }

    const paidUsersCoatchProgram = await CoachProgram.findById(
      req.params.id,
      "paidUsers"
    );
    if (
      paidUsersCoatchProgram &&
      paidUsersCoatchProgram.paidUsers &&
      paidUsersCoatchProgram.paidUsers
        .map((user) => user.toString())
        .includes(req.user.id)
    ) {
      return next(new ApiError("You already own this program", 401));
    }
    const data = {
      success_url: process.env.success_coachProgram_url,
      back_url: process.env.fail_payment_url,
      amount: coachProgram.price * 100,
      currency: "SAR",
      description: `coachProgram Payment from ${req.user.name}`,
      metadata: {
        coachProgram: req.params.id,
      },
    };

    const response = await generatePaymentSession(data);

    res
      .status(201)
      .json({ message: "Invoice created successfully", data: response.data });
  } catch (error) {
    console.error(
      "Error creating invoice:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.coachProgramcheckoutPayment = async (req, res, next) => {
  try {
    const response = await paymentCheckout(req.params.id);
    if (response.data.status === "paid") {
      const payment = await Payments.findOne({
        refId: response.data.id,
      });
      if (payment) {
        return next(new ApiError("expired payment token", 401));
      }
      const paymentid = new Payments({
        refId: response.data.id,
      });
      await paymentid.save();
      await CoachProgram.findByIdAndUpdate(
        response.data.metadata.coachProgram,
        {
          $push: { paidUsers: req.user.id },
        },
        { new: true }
      );
      await req.user.save();

      const coachProgramRequest = new CoachProgramRequest({
        user: req.user,
        course: response.data.metadata.coachProgram,
        userIP: response.data.payments ? response.data.payments[0].ip : null,
        status: response.data.status,
        amount: response.data.amount / 100,
        invoice_id: req.params.id,
        paidOn: Date.now(),
      });
      await coachProgramRequest.save();
    } else {
      console.error("Payment failed for invoice ID:", req.params.id);
      return res.status(400).json({ message: "Payment failed" });
    }
    res.status(200).json({ message: "Paid successfully", data: response.data });
  } catch (error) {
    console.error("Error processing payment:", error);
    next(error);
  }
};
