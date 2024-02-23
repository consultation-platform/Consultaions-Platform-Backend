const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/api.error");
const createToken = require("../utils/create.token");
const User = require("../models/user.model");

const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.uploadPlaylistImage = uploadSingleImage("image");

// @desc    Get list of users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const document = await User.find({}).select("name email phone role ");
  if (!document) next(new ApiError(`Error Happend `, 404));
  if (document.length === 0) {
    res.status(200).json({ message: "There Is NO users To Retrive" });
  } else {
    res.status(200).json({
      message: "Documents retrieved successfully",
      results: document.length,
      document,
    });
  }
});

// @desc    Get specific user by id
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ApiError(`the user  for this id ${req.params.id} not found `, 404)
    );
  // Extract specific properties from the user object
  const {
    fname,
    lname,
    birthdate,
    _id,
    email,
    active,
    role,
  } = user;

  // 4) send response to the client side with specific properties
  res.status(200).json({
    message: "user  retrieved successfully",
    data: {
      fname,
      lname,
      birthdate,
      _id,
      email,
      active,
      role,
    },
  });
});

// @desc    Update specific user role
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(201).json({ data: document });
});

// @desc    Get Logged user data
// @route   GET /api/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  if (req.user.active === false) {
    return next(new ApiError("This is unactive account ", 404));
  }
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  if (req.user.active === false) {
    return next(new ApiError("This is unactive account ", 404));
  }
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  if (req.user.active === false) {
    return next(new ApiError("This is unactive account ", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(201).json({ data: updatedUser });
});
