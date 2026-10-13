const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    acceptedCategories: [
      {
        type: String,
        enum: [
          "Clothing",
          "Electronics",
          "Books",
          "Furniture",
          "Home & Kitchen",
          "Accessories",
          "Other",
        ],
      },
    ],

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NGO", ngoSchema);