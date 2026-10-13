const express = require("express");

const {
  createItem,
    getAllItems,
    getItemById,
    getMyItems,
    updateItem,
    deleteItem,
} = require("../controllers/itemController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all available items
router.get("/", getAllItems);

// Get logged-in user's items
router.get("/my-items", protect, getMyItems);

// Get item by ID
router.get("/:id", getItemById);

// Add new item - Login required
router.post("/", protect, createItem);

// Update item - Login required
router.put("/:id", protect, updateItem);

// Delete item - Login required
router.delete("/:id", protect, deleteItem);

module.exports = router;