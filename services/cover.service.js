const factory = require("./handlers.factory");
const Cover = require("../models/cover.model");
const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.uploadCoverImage = uploadSingleImage("image");

exports.createCover = factory.createOne(Cover);

exports.deleteCover = factory.deleteOne(Cover);

exports.getCoverById = factory.getOne(Cover);

exports.updateCover = factory.updateOne(Cover);

exports.getAllCovers = factory.getAll(Cover);