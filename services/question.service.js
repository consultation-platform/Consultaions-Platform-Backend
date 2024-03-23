const factory = require("./handlers.factory");
const Question = require("../models/question.model")

exports.createQuestion = factory.createOne(Question);

exports.deleteQuestion = factory.deleteOne(Question);

exports.getQuestionById = factory.getOne(Question);

exports.getAllQuestions = factory.getAll(Question);

exports.updateQuestion = factory.updateOne(Question);
