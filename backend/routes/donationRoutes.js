const express = require("express");
const adminOnly = require("../middleware/adminMiddleware");
const {
  createDonationRequest,
  getMyDonationRequests,
  getAllDonationRequests,
  acceptDonationRequest,
  completeDonationRequest,
} = require("../controllers/donationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create donation request
router.post("/", protect, createDonationRequest);

// Get logged-in user's donation requests
router.get("/my-requests", protect, getMyDonationRequests);

// Get all donation requests (for admin)
router.get("/all", protect, getAllDonationRequests);

// Accept donation request (for NGO)
router.put("/:id/accept", protect,adminOnly, acceptDonationRequest);


// Complete donation request (for NGO)
router.put("/:id/complete", protect,adminOnly, completeDonationRequest);

module.exports = router;