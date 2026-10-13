const express = require("express");

const {
  getLeaderboard,
} = require("../controllers/leaderboardController");

const router = express.Router();

// Get top 10 eco users
router.get("/", getLeaderboard);

module.exports = router;