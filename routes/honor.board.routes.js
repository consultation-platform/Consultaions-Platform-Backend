const express = require("express");
const router = express.Router();
const {
  createHonorBoardItem,
  deleteHonorBoardItem,
  getHonorBoardItemById,
  getAllHonorBoardItems,
} = require("../services/honor.board.service");

const { allowedTo, protect } = require("../services/auth.service");

// Create Honor Board item
router.post("/", protect, allowedTo("manager", "admin"), createHonorBoardItem);

// Read all Honor Board items
router.get("/", getAllHonorBoardItems);

router.put("/:id", allowedTo("manager", "admin"), getHonorBoardItemById);

// Delete Honor Board item by ID
router.delete("/:id", deleteHonorBoardItem);

module.exports = router;
