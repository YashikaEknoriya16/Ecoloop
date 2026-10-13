import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setData(response.data))
      .catch(() => {
        setError("Dashboard load nahi hua. Please login again.");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (error) {
    return (
      <div className="dashboard-message">
        <h2>Oops! Something went wrong.</h2>
        <p>{error}</p>
        <Link to="/login" className="primary-btn">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-loading">
        <span>🌱</span>
        <p>Growing your dashboard...</p>
      </div>
    );
  }

  const stats = data.ecoStats || {};
  const name = data.user?.name || "Eco Champion";

  const statCards = [
    {
      icon: "🏆",
      value: stats.ecoPoints ?? 0,
      label: "Eco Points",
      note: "Your green score",
      color: "purple",
    },
    {
      icon: "♻️",
      value: stats.itemsReused ?? 0,
      label: "Items Reused",
      note: "Giving items a new life",
      color: "green",
    },
    {
      icon: "💚",
      value: stats.itemsDonated ?? 0,
      label: "Items Donated",
      note: "Making a difference",
      color: "orange",
    },
    {
      icon: "🌍",
      value: `${stats.co2Saved ?? 0} kg`,
      label: "CO₂ Saved",
      note: "Helping our planet",
      color: "blue",
    },
    {
      icon: "🧴",
      value: `${stats.plasticSaved ?? 0} kg`,
      label: "Plastic Saved",
      note: "Less waste, more hope",
      color: "pink",
    },
  ];

  return (
    <div className="eco-dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="brand-icon">🌿</span>
          <span>EcoLoop</span>
        </Link>

        <p className="sidebar-heading">WORKSPACE</p>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/items" className="sidebar-link">
            <span>♻</span> Browse Items
          </Link>

          <Link to="/add-item" className="sidebar-link">
            <span>＋</span> Add an Item
          </Link>

          <Link to="/donations" className="sidebar-link">
            <span>♡</span> My Donations
          </Link>

          <Link to="/leaderboard" className="sidebar-link">
            <span>🏆</span> Leaderboard
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>🌱</span>
            <h4>Small steps matter!</h4>
            <p>Your everyday choices can make the planet greener.</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="topbar-label">YOUR ECO SPACE</p>
            <h2>Dashboard</h2>
          </div>

          <div className="profile-chip">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{name}</strong>
              <span>Eco Member 🌱</span>
            </div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-tag">WELCOME BACK 👋</span>
            <h1>Hey, {name}!</h1>
            <p>
              Every item you reuse is a step towards a cleaner,
              greener world. Keep making a difference!
            </p>

            <Link to="/items" className="welcome-button">
              Explore Items <span>→</span>
            </Link>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <span className="art-sun">☀️</span>
            <span className="art-earth">🌍</span>
            <span className="art-plant">🌱</span>
          </div>
        </section>

        <section className="impact-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">YOUR CONTRIBUTION</p>
              <h2>My Eco Impact</h2>
            </div>
            <span className="live-label">
              <span></span> Your progress
            </span>
          </div>

          <div className="stats-grid">
            {statCards.map((card) => (
              <article
                className={`stat-card ${card.color}`}
                key={card.label}
              >
                <div className="stat-card-top">
                  <span className="stat-icon">{card.icon}</span>
                  <span className="stat-dots">•••</span>
                </div>

                <h3>{card.value}</h3>
                <p className="stat-label">{card.label}</p>
                <p className="stat-note">{card.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <p className="section-eyebrow">GET INVOLVED</p>
                <h2>Make an Impact</h2>
              </div>
              <span className="panel-emoji">🌎</span>
            </div>

            <div className="action-item">
              <span className="action-icon mint">♻️</span>
              <div className="action-text">
                <h3>Give Items a Second Life</h3>
                <p>Find useful items in your community.</p>
              </div>
              <Link to="/items" className="action-arrow" aria-label="Browse items">
                →
              </Link>
            </div>

            <div className="action-item">
              <span className="action-icon peach">🎁</span>
              <div className="action-text">
                <h3>Share What You Don't Need</h3>
                <p>List an item for someone else to use.</p>
              </div>
              <Link to="/add-item" className="action-arrow" aria-label="Add an item">
                →
              </Link>
            </div>
          </div>

          <div className="dashboard-panel eco-message">
            <span className="message-leaf">🌿</span>
            <p className="section-eyebrow">A LITTLE REMINDER</p>
            <h2>There is no such thing as a small act of kindness.</h2>
            <p>
              Reuse, donate and recycle. Together, we can build
              a world where less goes to waste.
            </p>
            <span className="message-decoration">GROW GREEN. LIVE CLEAN.</span>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>🌿 EcoLoop</span>
          <span>Reuse More. Waste Less. Make a Difference.</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;