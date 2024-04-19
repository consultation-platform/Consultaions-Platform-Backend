const express = require("express");
const router = express.Router();
const {
  getAllTools,
  getToolsById,
  createTools,
  uploadToolImage,
  deleteTools,
  updateTools,
} = require("../services/tools.service");
const { allowedTo, protect } = require("../services/auth.service");
const { saveSingleImage } = require("../middlewares/imageProcessing");

router.get("/", getAllTools);

router.post(
  "/",
  protect,
  allowedTo("manager", "admin"),
  uploadToolImage,
  saveSingleImage,
  createTools
);

router.put(
  "/:id",
  protect,
  allowedTo("manager", "admin"),
  uploadToolImage,
  saveSingleImage,
  updateTools
);

router.get("/:id", getToolsById);

router.delete("/:id", protect, allowedTo("manager", "admin"), deleteTools);

module.exports = router;
