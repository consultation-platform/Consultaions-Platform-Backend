const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please Enter you email"],
    },
    phone: {
      type: String,
    },
    birthdate: {
      type: Date,
    },

    emailVerifyCode: String,
    emailVerifyExpiers: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "mentor", "manager"],
      default: "mentor",
    },
    active: {
      type: Boolean,
      default: false,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    image: {
      type: String,
      required: false,
    },
    links: [String],
    desciption: String,
    field: String,
    hourePrice: Number,
  },
  { timestamps: true }
);

mentorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
