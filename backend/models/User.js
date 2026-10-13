const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    ecoPoints: {
      type: Number,
      default: 0,
    },

    itemsReused: {
      type: Number,
      default: 0,
    },

    itemsDonated: {
      type: Number,
      default: 0,
    },

    plasticSaved: {
      type: Number,
      default: 0,
    },

    co2Saved: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);