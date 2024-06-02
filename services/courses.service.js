const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const { uploadSingleImage } = require("../middlewares/uploadImages");
const Course = require("../models/course.model");
const Mentor = require("../models/mentor.model");
const factory = require("./handlers.factory");
const Payments = require("../models/payment.records");
const CourseRequest = require("../models/courses.payment.records");
const { subscribed } = require("../middlewares/check.subscription");
const { generateKey } = require("crypto");
const { generatePaymentSession, paymentCheckout } = require("../utils/payment");
exports.uploadCourseImage = uploadSingleImage("image");

exports.getCourseRequestById = async (req, res, next) => {
  try {
    const courseRequest = await CourseRequest.findById(req.params.id).populate({
      path: "course user",
      select: "title name phone email ",
    });
    if (!courseRequest) {
      return next(
        new ApiError(
          `the course request for this id ${req.params.id} is not exist`
        )
      );
    }
    res
      .status(200)
      .json({ message: "Course request found successfully", courseRequest });
  } catch (error) {
    console.error("Error occurred while getting course request:", error);
    res
      .status(500)
      .json({ error: "Failed to get course request", details: error.message });
  }
};

exports.deleteCourseRequest = factory.deleteOne(CourseRequest);

exports.getAllCourseRequests = async (req, res) => {
  try {
    const courseRequests = await CourseRequest.find()
      .populate({
        path: "course user",
        select: "title name -_id",
      })
      .select("user");
    if (!courseRequests) {
      return next(
        new ApiError(
          `the course request for this id ${req.params.id} is not exist`
        )
      );
    }
    res.status(200).json({
      success: true,
      length: courseRequests.length,
      data: courseRequests,
    });
  } catch (error) {
    console.error("Error occurred while getting course request:", error);
    res
      .status(500)
      .json({ error: "Failed to get course request", details: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { body, user } = req;
    const newCourse = new Course(body);
    newCourse.owner = user.id;
    newCourse.field = user.field;
    await newCourse.save();
    await Mentor.findByIdAndUpdate(
      user.id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error occurred while creating course:", error);
    res
      .status(500)
      .json({ error: "Failed to create course", details: error.message });
  }
};
exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const document = await Course.findById(req.params.id).populate({
    path: "videos",
    select: "title description url",
  });
  if (!document)
    return next(
      new ApiError(`the Document  for this id ${req.params.id} not found `, 404)
    );
  res.status(200).json(document);
});

exports.getAllCourses = factory.getAll(Course);

exports.getLoggedMentorCourses = asyncHandler(async (req, res, next) => {
  const course = await Course.find({
    owner: req.user.id,
  });
  if (!course) {
    return next(
      new ApiError(`The course for this mentor ${req.user.id} were not found`)
    );
  }
  res.status(200).json({ length: course.length, data: course });
});

exports.getAllCoursesForField = asyncHandler(async (req, res, next) => {
  try {
    let filterObj = {};

    if (req.query.field) {
      filterObj.field = req.query.field;
    }
    if (req.query.field === "selectAll") {
      filterObj = {};
    }
    const courses = await Course.find(filterObj);

    // Check if courses array is empty
    if (courses.length === 0) {
      return next(
        new ApiError(`No courses found for field ${req.query.field}`)
      );
    }

    // Return courses
    res.status(200).json({ length: courses.length, data: courses });
  } catch (error) {
    // Handle other errors
    return next(new ApiError(`Error retrieving courses: ${error.message}`));
  }
});

exports.getAllCoursesForMentor = asyncHandler(async (req, res, next) => {
  const mentor = await Mentor.findById(req.params.mentor);
  if (!mentor) {
    return next(
      new ApiError(
        `The mentor ${req.params.mentor} was not found in the database`
      )
    );
  }
  const courses = await Course.find({
    owner: req.params.mentor,
  });
  if (!courses) {
    return next(
      new ApiError(
        `The courses for this mentor ${req.params.mentor} were not found`
      )
    );
  }
  res.status(200).json({ length: courses.length, data: courses });
});

exports.coursePaymentSession = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(
        new ApiError(`The course with ID ${req.params.id} was not found`, 404)
      );
    }

    const paidUsersCourses = await Course.findById(req.params.id, "paidUsers");
    if (
      paidUsersCourses &&
      paidUsersCourses.paidUsers &&
      paidUsersCourses.paidUsers
        .map((user) => user.toString())
        .includes(req.user.id)
    ) {
      return next(new ApiError("You already own this course", 401));
    }
    const data = {
      success_url: process.env.success_course_url,
      back_url: process.env.fail_payment_url,
      amount: course.price * 100,
      currency: "SAR",
      description: `Course Payment from ${req.user.name}`,
      metadata: {
        course: req.params.id,
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

exports.checkoutPayment = async (req, res, next) => {
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
      const course = await Course.findByIdAndUpdate(
        response.data.metadata.course,
        {
          $push: { paidUsers: req.user.id },
        },
        { new: true }
      );
      req.user.courses.push(course._id);
      await req.user.save();
      const mentor = await Mentor.findById(course.owner);
      const { fees } = mentor;
      let amount = response.data.amount / 100;
      amount = amount - amount * (fees / 100);

      await Mentor.findByIdAndUpdate(
        course.owner,
        { $inc: { balance: amount } },
        { new: true }
      );

      const courseRequest = new CourseRequest({
        user: req.user,
        course: response.data.metadata.course,
        userIP: response.data.payments ? response.data.payments[0].ip : null,
        status: response.data.status,
        amount: response.data.amount / 100,
        invoice_id: req.params.id,
        paymentGatewayFees: response.data.payments
          ? response.data.payments[0].fee_format
          : null,
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
        cardNumber:
          (response.data.payments &&
            response.data.payments[0].source &&
            response.data.payments[0].source.number) ||
          null,
        paidOn: Date.now(),
      });
      await courseRequest.save();
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

exports.checksubscribed = subscribed(Course);
