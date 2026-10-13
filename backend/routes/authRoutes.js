const express = require("express");

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER
router.post("/register", register);


// LOGIN
router.post("/login", login);


// PROFILE
router.get("/profile", protect, getProfile);


module.exports = router;