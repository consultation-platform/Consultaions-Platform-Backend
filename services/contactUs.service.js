const ContactForm = require("../models/contactUs.model");
const factory = require("./handlers.factory");

exports.createContactForm = factory.createOne(ContactForm);

exports.deleteContactForm = factory.deleteOne(ContactForm);

exports.getContactFormById = factory.getById(ContactForm);

exports.getAllContactForms = factory.getAll(ContactForm);

exports.deleteAllContactForms = factory.deleteAll(ContactForm);
