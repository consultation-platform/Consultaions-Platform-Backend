const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const Book = require("../models/book.model");
const factory = require("./handlers.factory");
const { subscribed } = require("../middlewares/check.subscription");
const { generatePaymentSession, paymentCheckout } = require("../utils/payment");
const Payments = require("../models/payment.records");
const { uploadMixOfImages } = require("../middlewares/imagesAndFilesProcess");
const Mentor = require("../models/mentor.model");

exports.uploadBookImgsAndFile = uploadMixOfImages([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "pdf",
    maxCount: 1,
  },
]);
exports.createBook = asyncHandler(async (req, res, next) => {
  try {
    const { body, user } = req;
    const book = new Book(body);
    book.owner = user.id;
    book.field = user.field;
    const document = await book.save();
    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
});

exports.updateBook = factory.updateOne(Book);

exports.deleteBook = factory.deleteOne(Book);

exports.getBookById = factory.getOne(Book);

exports.getAllBooks = asyncHandler(async (req, res, next) => {
  const document = await Book.find()
    .select("title image description price owner ")
    .populate({
      path: "owner",
      select: "name",
    });
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

exports.checksubscribed = subscribed(Book);

exports.bookPaymentSession = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  const book = await Book.findById(id);
  if (!book) {
    return next(new ApiError(`The book with ID ${id} was not found`, 404));
  }

  const userAlreadyOwnsBook = await Book.findOne({
    _id: id,
    paidUsers: req.user._id,
  });
  if (userAlreadyOwnsBook) {
    return next(new ApiError(`You already own this book`, 400));
  }

  const paymentData = {
    success_url: process.env.SUCCESS_BOOK_URL,
    back_url: process.env.FAIL_PAYMENT_URL,
    amount: book.price * 100,
    currency: "SAR",
    description: `Book Payment from ${req.user.name}`,
    metadata: {
      book: id,
      userId: req.user._id,
    },
  };

  const session = await generatePaymentSession(paymentData);

  res.status(200).json({
    success: true,
    session: session.data,
  });
});

exports.bookPaymentCheckout = asyncHandler(async (req, res, next) => {
  try {
    const response = await paymentCheckout(req.params.id);
    if (response.data.status === "paid") {
      const payment = await Payments.findOne({
        refId: response.data.id,
      });
      if (payment) {
        // return res.status(401).json({ message: "Expired payment token" });
      }
      const paymentid = new Payments({
        refId: response.data.id,
      });
      await paymentid.save();
      const book = await Book.findByIdAndUpdate(
        response.data.metadata.book,
        {
          $push: { paidUsers: req.user.id },
        },
        { new: true }
      );
      req.user.books.push(book._id);
      await req.user.save();
      const mentor = await Mentor.findById(book.owner);
      const { fees } = mentor;
      let amount = response.data.amount / 100;
      amount = amount - amount * (fees / 100);

      await Mentor.findByIdAndUpdate(
        book.owner,
        { $inc: { balance: amount } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } else {
      console.error("Payment failed for invoice ID:", req.params.id);
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    next(error);
  }
});
