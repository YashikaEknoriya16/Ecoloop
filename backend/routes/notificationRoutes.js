const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

// Get all notifications of logged-in user
router.get("/", protect, getMyNotifications);

// Mark one notification as read
router.patch("/:id/read", protect, markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsAsRead);

module.exports = router;
