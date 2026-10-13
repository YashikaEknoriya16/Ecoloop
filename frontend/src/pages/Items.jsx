
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Items.css";

const categories = [
  { name: "All Items", icon: "🌿" },
  { name: "Clothes", icon: "👕" },
  { name: "Books", icon: "📚" },
  { name: "Furniture", icon: "🪑" },
  { name: "Electronics", icon: "💻" },
  { name: "Accessories", icon: "🎒" },
  { name: "Other", icon: "📦" },
];

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Items");
  const [type, setType] = useState("All");

  const [requestMessages, setRequestMessages] = useState({});
  const [requestStatus, setRequestStatus] = useState({});
  const [sendingRequest, setSendingRequest] = useState({});

  useEffect(() => {
    API.get("/items")
      .then((response) => {
        const result = response.data;
        const list = Array.isArray(result)
          ? result
          : result.items || result.data || [];

        setItems(list);
      })
      .catch(() => {
        setError("Items load nahi ho paaye. Backend server check karo.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExchangeRequest = async (itemId) => {
    setRequestStatus((prev) => ({ ...prev, [itemId]: "" }));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setRequestStatus((prev) => ({
          ...prev,
          [itemId]: "Please login first to request an exchange.",
        }));
        return;
      }

      setSendingRequest((prev) => ({ ...prev, [itemId]: true }));

      const response = await API.post(
        "/exchanges",
        {
          itemId,
          message: requestMessages[itemId] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestStatus((prev) => ({
        ...prev,
        [itemId]:
          response.data.message || "Exchange request sent successfully!",
      }));
    } catch (err) {
      setRequestStatus((prev) => ({
        ...prev,
        [itemId]:
          err.response?.data?.message ||
          "Could not send request. Please try again.",
      }));
    } finally {
      setSendingRequest((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemName = item.title || item.name || "";

      const matchesSearch =
        itemName.toLowerCase().includes(search.trim().toLowerCase()) ||
        (item.category || "")
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All Items" ||
        (item.category || "").toLowerCase() === category.toLowerCase() ||
        (category === "Clothes" &&
          (item.category || "").toLowerCase() === "clothing");

      const matchesType =
        type === "All" ||
        (item.type || "").toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, search, category, type]);

  return (
    <main className="items-page">
      <header className="items-header">
        <Link to="/dashboard" className="items-brand">
          🌿 EcoLoop
        </Link>
        <Link to="/dashboard" className="items-back">
          ← Dashboard
        </Link>
      </header>

      <section className="items-hero">
        <span>REUSE · SHARE · CARE</span>
        <h1>Give Things a Second Life 🌱</h1>
        <p>Discover useful items and make sustainable choices.</p>
      </section>

      <section className="items-content">
        <div className="items-title-row">
          <div>
            <h2>Explore Items</h2>
            <p>Find something useful in your community.</p>
          </div>
          <span className="items-count">{filteredItems.length} items</span>
        </div>

        <div className="items-toolbar">
          <div className="items-search">
            <span>🔍</span>
            <input
              type="search"
              placeholder="Search clothes, books, furniture..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search items"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <select
            className="items-type-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
            aria-label="Filter by item type"
          >
            <option value="All">All types</option>
            <option value="Sell">Sell</option>
            <option value="Donate">Donate</option>
            <option value="Exchange">Exchange</option>
          </select>
        </div>

        <div className="category-filters">
          {categories.map((itemCategory) => (
            <button
              key={itemCategory.name}
              className={`category-filter ${
                category === itemCategory.name ? "selected" : ""
              }`}
              onClick={() => setCategory(itemCategory.name)}
            >
              <span>{itemCategory.icon}</span>
              {itemCategory.name}
            </button>
          ))}
        </div>

        {loading && (
          <p className="items-message">🌱 Loading items...</p>
        )}

        {error && <p className="items-error">{error}</p>}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="items-empty">
            <span>🔎</span>
            <h3>No matching items found</h3>
            <p>Try another search or select a different category.</p>
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearch("");
                setCategory("All Items");
                setType("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="items-grid">
            {filteredItems.map((item) => (
              <article className="item-card" key={item._id}>
                <div className="item-visual">
                  {item.category?.toLowerCase() === "clothes" ||
                  item.category?.toLowerCase() === "clothing"
                    ? "👕"
                    : item.category?.toLowerCase() === "books"
                    ? "📚"
                    : item.category?.toLowerCase() === "furniture"
                    ? "🪑"
                    : item.category?.toLowerCase() === "electronics"
                    ? "💻"
                    : item.category?.toLowerCase() === "accessories"
                    ? "🎒"
                    : "♻️"}
                </div>

                <div className="item-card-body">
                  <span className="item-category">
                    {item.category || "Other"}
                  </span>

                  <h3>{item.title || item.name || "Untitled Item"}</h3>

                  <p className="item-condition">
                    Condition: {item.condition || "Not specified"}
                  </p>

                  <p className="item-location">
                    📍 {item.location || "Location not specified"}
                  </p>

                  <div className="item-card-footer">
                    <span className="item-type">
                      {item.type || "Available"}
                    </span>
                    <span className="item-price">
                      {Number(item.price) > 0
                        ? `₹${item.price}`
                        : "Free"}
                    </span>
                  </div>

                  {item.type === "Exchange" &&
                    item.status === "Available" && (
                      <div className="exchange-request-box">
                        <label htmlFor={`message-${item._id}`}>
                          Message to item owner (optional)
                        </label>

                        <textarea
                          id={`message-${item._id}`}
                          value={requestMessages[item._id] || ""}
                          onChange={(event) =>
                            setRequestMessages((prev) => ({
                              ...prev,
                              [item._id]: event.target.value,
                            }))
                          }
                          placeholder="Hi! I would like to exchange this item."
                          maxLength={500}
                          rows={3}
                          disabled={sendingRequest[item._id]}
                        />

                        <button
                          type="button"
                          className="clear-filters-btn"
                          onClick={() => handleExchangeRequest(item._id)}
                          disabled={sendingRequest[item._id]}
                        >
                          {sendingRequest[item._id]
                            ? "Sending..."
                            : "🔄 Request Exchange"}
                        </button>

                        {requestStatus[item._id] && (
                          <p role="status" aria-live="polite">
                            {requestStatus[item._id]}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Items;
