const mongoose = require("mongoose");

const { Schema } = mongoose;

const fieldsSchema = new Schema({
  field: {
    type: [String],
  },
});

const Consulting_fields = mongoose.model("Consulting-fields", fieldsSchema);
module.exports = Consulting_fields;
