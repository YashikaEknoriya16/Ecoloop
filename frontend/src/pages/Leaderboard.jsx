
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/leaderboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const result = response.data;

        const leaderboardUsers = Array.isArray(result)
          ? result
          : result.leaderboard || result.users || result.data || [];

        setUsers(
          Array.isArray(leaderboardUsers) ? leaderboardUsers : []
        );
      })
      .catch((err) => {
        console.error("Leaderboard error:", err);
        setError("Leaderboard load nahi hui. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const sortedUsers = [...users].sort(
    (a, b) => (b.ecoPoints || 0) - (a.ecoPoints || 0)
  );

  return (
    <main className="leaderboard-page">
      <header className="leaderboard-header">
        <Link to="/dashboard" className="leaderboard-brand">
          🌿 EcoLoop
        </Link>

        <Link to="/dashboard" className="leaderboard-back">
          ← Dashboard
        </Link>
      </header>

      <section className="leaderboard-hero">
        <span>SMALL ACTIONS, BIG IMPACT</span>
        <h1>Eco Champions 🏆</h1>
        <p>
          Celebrating people who are making our planet greener.
        </p>
      </section>

      <section className="leaderboard-content">
        <h2>Community Leaderboard</h2>
        <p className="leaderboard-subtitle">
          Rankings based on eco-points.
        </p>

        {loading && <p>🌱 Loading leaderboard...</p>}

        {error && <p className="leaderboard-error">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <div className="leaderboard-empty">
            <span>🌱</span>
            <h3>No rankings yet</h3>
            <p>Start contributing to become an Eco Champion!</p>
            <Link to="/add-item">Add an Item</Link>
          </div>
        )}

        {!loading && !error && sortedUsers.length > 0 && (
          <>
            {/* Top 3 cards: table ke bahar */}
            <div className="leaderboard-top-three">
              {sortedUsers.slice(0, 3).map((user, index) => (
                <div
                  key={user._id || user.id || index}
                  className={`leaderboard-champion rank-${index + 1}`}
                >
                  <div className="champion-medal">
                    {["🥇", "🥈", "🥉"][index]}
                  </div>

                  <h3>{user.name || "Eco Member"}</h3>
                  <p>Rank #{index + 1}</p>

                  <strong>
                    🌿 {user.ecoPoints || 0} Points
                  </strong>
                </div>
              ))}
            </div>

            {/* Complete leaderboard table */}
            <div className="leaderboard-table-wrap">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Eco Champion</th>
                    <th>Items Reused</th>
                    <th>Items Donated</th>
                    <th>Plastic Saved</th>
                    <th>Eco Points</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      <td>
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                      </td>

                      <td className="leaderboard-user-name">
                        👤 {user.name || "Eco Member"}
                      </td>

                      <td>{user.itemsReused || 0}</td>
                      <td>{user.itemsDonated || 0}</td>
                      <td>♻️ {user.plasticSaved || 0}</td>

                      <td className="leaderboard-points">
                        🌿 {user.ecoPoints || 0} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Leaderboard;
