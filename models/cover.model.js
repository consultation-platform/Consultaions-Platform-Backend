const mongoose = require("mongoose")

const coverSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Cover = mongoose.model("Cover", coverSchema);

module.exports = Cover;