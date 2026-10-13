import { useEffect, useState } from "react";
import API from "../services/api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        // const response = await API.get("/notifications");
        const token = localStorage.getItem("token");

const response = await API.get("/notifications", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
        if (isMounted) {
          setNotifications(response.data.notifications || []);
          setError("");
        }
      } catch (err) {
        console.error("Fetch notifications error:", err);

        if (isMounted) {
          setError("Could not load notifications. Please login again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = async (id) => {
    try {
    //   await API.patch(`/notifications/${id}/read`);
const token = localStorage.getItem("token");

await API.patch(
  `/notifications/${id}/read`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
      setError("Could not mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
    //   await API.patch("/notifications/read-all");
const token = localStorage.getItem("token");

await API.patch(
  "/notifications/read-all",
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Mark all as read error:", err);
      setError("Could not update notifications.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  if (loading) {
    return (
      <div className="notifications-page">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>🔔 Notifications</h1>
          <p>You have {unreadCount} unread notifications.</p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-read-btn"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {error && (
        <p className="notification-error">{error}</p>
      )}

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <span>🔕</span>
          <h3>No notifications yet</h3>
          <p>
            When someone requests an exchange, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                notification.isRead ? "read" : "unread"
              }`}
            >
              <div className="notification-icon">🔔</div>

              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>

                <small>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>
              </div>

              {!notification.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
