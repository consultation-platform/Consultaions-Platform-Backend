const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");
const User = require("../models/user.model");

const Consulting_fields = require("../models/cons.fields.model");
const factory = require("./handlers.factory");

exports.createField = factory.createOne(Consulting_fields);
exports.updateField = factory.updateOne(Consulting_fields);
exports.deleteField = factory.deleteOne(Consulting_fields);
exports.getAllFiedls = factory.getAll(Consulting_fields);
