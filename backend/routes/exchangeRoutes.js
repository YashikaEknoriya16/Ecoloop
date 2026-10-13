const express = require("express");
const router = express.Router();

const {
  createExchangeRequest,
  getMyExchangeRequests,
  acceptExchangeRequest,
  rejectExchangeRequest,
  completeExchangeRequest,
} = require("../controllers/exchangeController");

const protect = require("../middleware/authMiddleware");

// Send an exchange request
router.post("/", protect, createExchangeRequest);

// Get exchange requests
router.get("/", protect, getMyExchangeRequests);

// Accept an exchange request
router.patch("/:id/accept", protect, acceptExchangeRequest);

// Reject an exchange request
router.patch("/:id/reject", protect, rejectExchangeRequest);

// Mark an exchange as completed
router.patch("/:id/complete", protect, completeExchangeRequest);

module.exports = router;
