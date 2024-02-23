// routes/cotactFormRoutes.js
const express = require("express");

const router = express.Router();

const {
  createContactForm,
  getContactFormById,
  getAllContactForms,
  deleteContactForm,
  deleteAllContactForms,
} = require("../services/contactUs.service");

const {
  contactFormValidation,
  FormIdValidation,
} = require("../utils/validations/contactUs.validations");

const { allowedTo, protect } = require("../services/auth.service");

// Create contactForm
router.post("/", contactFormValidation, createContactForm);

router.use(protect);
//  Read contactForms
router.get("/", allowedTo("manager"), getAllContactForms);

//  Get contactForm by id
router.get("/:id", allowedTo("manager"), FormIdValidation, getContactFormById);

//  Delete contactForm
router.delete(
  "/:id",
  allowedTo("manager"),
  FormIdValidation,
  deleteContactForm
);

// Detele All contactForms
router.delete("/", allowedTo("manager"), deleteAllContactForms);

// module.exports = router;
module.exports = router;
