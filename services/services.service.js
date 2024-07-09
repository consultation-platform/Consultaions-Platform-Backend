const factory = require("./handlers.factory");
const Services = require("../models/services.model");

exports.createService = factory.createOne(Services);

exports.deleteService = factory.deleteOne(Services);

exports.getServiceById = factory.getOne(Services);

exports.getAllService = factory.getAll(Services);

exports.updateService = factory.updateOne(Services);
