const HonorBoard = require("../models/honor.board.model");
const factory = require("./handlers.factory");

exports.createHonorBoardItem = factory.createOne(HonorBoard);

exports.deleteHonorBoardItem = factory.deleteOne(HonorBoard);

exports.getHonorBoardItemById = factory.getOne(HonorBoard);

exports.getAllHonorBoardItems = factory.getAll(HonorBoard);

exports.updateHonorBoardItem = factory.updateOne(HonorBoard);
