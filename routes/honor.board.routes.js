const express = require("express");
const router = express.Router();
const {
  createHonorBoardItem,
  deleteHonorBoardItem,
  getAllHonorBoardItems,
} = require("../services/honor.board.service");

const { allowedTo, protect } = require("../services/auth.service");

// Create Honor Board item
router.post("/", protect, createHonorBoardItem);

// Read all Honor Board items
router.get("/", getAllHonorBoardItems);

// Delete Honor Board item by ID
router.delete("/:id", deleteHonorBoardItem);

module.exports = router;
