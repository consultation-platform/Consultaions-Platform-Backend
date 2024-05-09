const factory = require("./handlers.factory");
const AboutUs = require("../models/about-us.model");
const expressAsyncHandler = require("express-async-handler");

exports.create = factory.createOne(AboutUs);

exports.getById = factory.getOne(AboutUs);

exports.update = factory.updateOne(AboutUs);

exports.delete = factory.deleteOne(AboutUs);

exports.getAll = expressAsyncHandler(async (req, res, next) => {
  const document = await AboutUs.find();
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
