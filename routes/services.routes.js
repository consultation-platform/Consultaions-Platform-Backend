const express = require("express");
const router = express.Router();

const { allowedTo, protect } = require("../services/auth.service");
const {
  getAllService,
  createService,
  updateService,
  getServiceById,
  deleteService,
} = require("../services/services.service");

router.get("/", getAllService);

router.post("/", protect, allowedTo("manager", "admin"), createService);

router.put("/:id", protect, allowedTo("manager", "admin"), updateService);

router.get("/:id", getServiceById);

router.delete("/:id", protect, allowedTo("manager", "admin"), deleteService);

module.exports = router;
