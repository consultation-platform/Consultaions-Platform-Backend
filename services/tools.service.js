const factory = require("./handlers.factory");
const Tools = require("../models/tools.model");
const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.uploadToolImage = uploadSingleImage("image");

exports.createTools = factory.createOne(Tools);

exports.deleteTools = factory.deleteOne(Tools);

exports.getToolsById = factory.getOne(Tools);

exports.getAllTools = factory.getAll(Tools);

exports.updateTools = factory.updateOne(Tools);
