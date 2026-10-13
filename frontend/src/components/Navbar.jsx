
// import { NavLink, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   return (
//     <nav className="eco-navbar">
//       <NavLink to="/dashboard" className="eco-logo">
//         🌿 EcoLoop
//       </NavLink>

//       <div className="eco-nav-links">
//         <NavLink to="/dashboard">Dashboard</NavLink>
//         <NavLink to="/items">Browse Items</NavLink>
//         <NavLink to="/add-item">Add Item</NavLink>
//         <NavLink to="/donations">Donations</NavLink>
//         <NavLink to="/leaderboard">Leaderboard</NavLink>
//         <NavLink to="/exchange">Exchange Requests</NavLink>
//       </div>

//       <button className="eco-logout" onClick={handleLogout}>
//         Logout
//       </button>
//     </nav>
//   );
// }

// export default Navbar;


import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await API.get("/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setUnreadCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Could not fetch notifications:", error);
      }
    };

    fetchNotifications();

    // Refresh unread count every 15 seconds
    const intervalId = setInterval(fetchNotifications, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="eco-navbar">
      <NavLink to="/dashboard" className="eco-logo">
        🌿 EcoLoop
      </NavLink>

      <div className="eco-nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/items">Browse Items</NavLink>
        <NavLink to="/add-item">Add Item</NavLink>
        <NavLink to="/donations">Donations</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
        <NavLink to="/exchange">Exchange Requests</NavLink>

        <NavLink to="/notifications" className="eco-notification-link">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="eco-notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </NavLink>
      </div>

      <button className="eco-logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
