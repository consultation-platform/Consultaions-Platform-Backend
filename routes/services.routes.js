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

router.post("/", createService);

router.put("/:id", updateService);

router.get("/:id", getServiceById);

router.delete("/:id", deleteService);

module.exports = router;
