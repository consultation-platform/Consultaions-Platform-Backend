const express = require("express");
const router = express.Router();
const {
  createField,
  updateField,
  deleteField,
  getAllFiedls,
} = require("../services/cons.fields.service");

// Create a new field
router.post("/", createField);

// Get all fields
router.get("/", getAllFiedls);

// Update a field by ID
router.put("/:id", updateField);

// Delete a field by ID
router.delete("/:id", deleteField);

module.exports = router;
