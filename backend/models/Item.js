const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
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

    condition: {
      type: String,
      required: true,
      enum: [
        "New",
        "Like New",
        "Good",
        "Fair",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Sell",
        "Donate",
        "Exchange",
      ],
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: true,
    },

    ecoImpact: {
      plasticSaved: {
        type: Number,
        default: 0,
      },

      co2Saved: {
        type: Number,
        default: 0,
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Sold",
        "Exchanged",
        "Donated",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);