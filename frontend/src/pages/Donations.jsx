import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Donations.css";

import { useNavigate } from "react-router-dom";

function Donations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

  if (!token) {
  navigate("/login");
  return;
}

    API.get("/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const result = response.data;
        const allItems = Array.isArray(result)
          ? result
          : result.items || result.data || [];

        // Show only items created by the logged-in user
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const userId = user._id || user.id;

        const myItems = allItems.filter((item) => {
          const ownerId =
            typeof item.owner === "object"
              ? item.owner?._id
              : item.owner;

          return (
            ownerId &&
            userId &&
            String(ownerId) === String(userId) &&
            item.type === "Donate"
          );
        });

        setItems(myItems);
      })
      .catch(() => {
        setError("Donations load nahi hui. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="donations-page">
      <header className="donations-header">
        <Link to="/dashboard" className="donations-brand">
          🌿 EcoLoop
        </Link>

        <Link to="/dashboard" className="donations-back">
          ← Dashboard
        </Link>
      </header>

      <section className="donations-hero">
        <span>YOUR KINDNESS MATTERS</span>
        <h1>My Donations 💚</h1>
        <p>
          Every donation gives an item a second life and
          helps create a greener world.
        </p>
      </section>

      <section className="donations-content">
        <div className="donations-title-row">
          <div>
            <h2>Items I've Shared</h2>
            <p>Your items listed for donation.</p>
          </div>

          <span className="donations-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {loading && (
          <p className="donations-message">
            🌱 Loading your donations...
          </p>
        )}

        {error && (
          <p className="donations-error">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="donations-empty">
            <span>🎁</span>
            <h3>No donations yet</h3>
            <p>
              List an item as a donation to see it here.
            </p>

            <Link
              to="/add-item"
              className="donations-add-button"
            >
              + Donate an Item
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="donations-grid">
            {items.map((item) => (
              <article
                className="donation-card"
                key={item._id}
              >
                <div className="donation-card-visual">
                  {item.category === "Clothing"
                    ? "👕"
                    : item.category === "Books"
                    ? "📚"
                    : item.category === "Furniture"
                    ? "🪑"
                    : item.category === "Electronics"
                    ? "💻"
                    : item.category === "Accessories"
                    ? "🎒"
                    : "🎁"}
                </div>

                <div className="donation-card-body">
                  <span className="donation-category">
                    {item.category}
                  </span>

                  <h3>{item.title}</h3>

                  <p>
                    {item.description || "Shared with care 💚"}
                  </p>

                  <div className="donation-details">
                    <span>Condition: {item.condition}</span>
                    <span>📍 {item.location}</span>
                  </div>

                  <div className="donation-card-footer">
                    <span className="donation-status">
                      {item.status || "Available"}
                    </span>
                    <span className="donation-price">
                      {Number(item.price) > 0
                        ? `₹${item.price}`
                        : "Free"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Donations;
