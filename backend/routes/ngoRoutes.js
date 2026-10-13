const express = require("express");
const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  getAllNGOs,
  getNGOById,
  createNGO,
} = require("../controllers/ngoController");

const router = express.Router();

// Get all verified NGOs
router.get("/", getAllNGOs);

// Create NGO
router.post("/",protect, adminOnly, createNGO);

// Get NGO by ID
router.get("/:id", getNGOById);

module.exports = router;