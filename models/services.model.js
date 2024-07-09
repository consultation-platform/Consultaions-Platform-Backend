const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Services = mongoose.model("Services", servicesSchema);

module.exports = Services;
