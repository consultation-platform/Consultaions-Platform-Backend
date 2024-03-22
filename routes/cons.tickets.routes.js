const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTicketById,
  getAllTicketsForField,
  getAllTicketsForMentor,
  deleteTicket,
} = require("../services/tickets.service");

// const {
//   ticketValidation,
//   TicketIdValidation,
// } = require("../utils/validations/ticket.validations");

const { allowedTo, protect } = require("../services/auth.service");
const { checkTicketOwner } = require("../middlewares/check.ticket.owner");

// Create ticket
router.post("/", protect, allowedTo("mentor", "manager"), createTicket);

// Get all tickets for field
router.get("/field/:field", getAllTicketsForField);

// Get all tickets for mentor
router.get("/mentor/:mentor", getAllTicketsForMentor);

// Get ticket by id
router.get("/:id", getTicketById);

// Delete ticket
router.delete(
  "/:id",
  protect,
  allowedTo("mentor", "manager"),
  checkTicketOwner,
  deleteTicket
);

module.exports = router;
