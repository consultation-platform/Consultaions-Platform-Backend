const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const sendEmail = require("../utils/send.email");
const createToken = require("../utils/create.token");
const User = require("../models/user.model");

exports.signup = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findOne({ email: req.body.email });
  if (currentUser) {
    return next(new ApiError(`sorry this user allready exists`, 401));
  }
  // 1- Create user
  const user = await User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate and send verification code to the user's email
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Save the verification code and its expiry time in the user model
  user.emailVerifyCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  user.emailVerifyExpiers = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // 3- Send the verification code via SMS
  const message = `Hi ${user.name},
  \n We received a request to reset the password on your Sayees Account.
  \n ${verificationCode} \n Enter this code to complete the reset.
   \n Thanks for helping us keep your account secure.
   \n The E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError("Error sending verification code", 500));
  }

  res.status(200).json({ message: "Verification code sent to your email" });
});

exports.signupMentor = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findOne({ email: req.body.email });
  if (currentUser) {
    return next(new ApiError(`sorry this user allready exists`, 401));
  }
  // 1- Create user
  const user = await User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    socialMedia: req.body.socialMedia,
    field: req.body.field,
    description: req.body.description,
  });

  // 2- Generate and send verification code to the user's email
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Save the verification code and its expiry time in the user model
  user.emailVerifyCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  user.emailVerifyExpiers = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // 3- Send the verification code via SMS
  const message = `Hi ${user.name},
  \n We received a request to reset the password on your Sayees Account.
  \n ${verificationCode} \n Enter this code to complete the reset.
   \n Thanks for helping us keep your account secure.
   \n The E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError("Error sending verification code", 500));
  }

  res.status(200).json({ message: "Verification code sent to your email" });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.emailVerifyCode)
    .digest("hex");

  const user = await User.findOne({
    emailVerifyCode: hashedResetCode,
    emailVerifyExpiers: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.emailVerified = true;
  await user.save();
  // 3) generate token
  const token = createToken(user._id);

  // Save the token in the cookies
  res.cookie("jwt", token, {
    httpOnly: true,
    path: "/",
    maxAge: 240 * 60 * 60 * 1000,
    sameSite: "None",
    secure: (process.env.NODE_ENV = "production"),
  });

  res.status(200).json({
    status: "Success",
  });
});

exports.resendVerificationCode = asyncHandler(async (req, res, next) => {
  // 2) Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // 3) Check if the user's email is already verified
  if (user.emailVerified) {
    return next(new ApiError("User email is already verified", 400));
  }

  // 4) Generate and send a new verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Save the new verification code and its expiry time in the user model
  user.emailVerifyCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  user.emailVerifyExpiers = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // 5) Send the new verification code via SMS
  const message = `Hi ${user.name},
    \n your new verification code is
    \n ${verificationCode}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Email Verify code (valid for 10 min)",
      message,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError("Error sending verification code", 500));
  }

  res.status(200).json({ message: "New verification code sent to your email" });
});

// @desc    Login
// @route   GET /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  try {
    // 1) Check if email and password are in the request body
    if (!req.body.email || !req.body.password) {
      return next(new ApiError("email and password are required", 400));
    }

    // 3) Find user by email number
    const user = await User.findOne({ email: req.body.email });

    // 4) Check if the user exists
    if (!user) {
      return next(new ApiError("User not found", 404));
    }


    // 5) Check if the user is email verified
    if (user.emailVerified === false) {
      return next(new ApiError("Please verify your email first", 401));
    }

    // 6) Check if the password is correct
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError("Incorrect password", 401));
    }

    // 7) Generate token
    const token = createToken(user._id);

    // 8) Save the token in the cookies
    res.cookie("jwt", token, {
      httpOnly: true,
      path: "/",
      maxAge: 240 * 60 * 60 * 1000,
      sameSite: "None",
      // secure: (process.env.NODE_ENV = "production"),
    });

    // 9) Extract specific properties from the user object
    const { _id, name, email, role } = user;

    // 10) Send response to the client with specific properties
    res.status(200).json({ data: { _id, name, email, role }, token: token });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    return next(new ApiError("Internal Server Error", 500));
  }
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exists in cookies
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc    Request password reset
// @route   POST /api/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with this email number ${req.body.email}`,
        404
      )
    );
  }

  // 2) Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  //  3) Send the reset code via email
  const message = `Hi ${user.name},
    \n Your password resete code is . 
   \n ${resetCode} `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    console.log(err);
    await user.save();
    return next(new ApiError("There is an error in sending Resete Code ", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to your email " });
});

// @desc    Verify password reset code
// @route   POST /api/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  // 3) generate token
  const token = createToken(user._id);

  // Save the token in the cookies
  res.cookie("jwt", token, {
    httpOnly: true,
    path: "/",
    maxAge: 240 * 60 * 60 * 1000,
    sameSite: "None",

    secure: (process.env.NODE_ENV = "production"),
  });
  res.status(200).json({
    status: "Success",
  });
});

// @desc    Reset password
// @route   POST /api/auth/resetPassword
// @access  Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Check if token exists in cookies
  let token = req.cookies.jwt;
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded.userId);
  // 3) Check if user exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.password;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  token = createToken(user._id);

  // Extract specific properties from the user object
  const { _id, name, email, role } = user;

  // 4) send response to the client side with specific properties
  res.status(200).json({ data: { _id, name, email, role }, token: token });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt", {
    path: "/",
    sameSite: "None",
    httpOnly: true,
    secure: (process.env.NODE_ENV = "production"),
  });
  res.status(200).json({ Message: "Logged out success" });
});
