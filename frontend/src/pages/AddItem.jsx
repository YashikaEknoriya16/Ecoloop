import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AddItem.css";

const initialForm = {
  title: "",
  category: "Clothing",
  condition: "Good",
  type: "Donate",
  price: "0",
  location: "",
  description: "",
};

function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Submit item to backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/items",
        {
          ...form,
          price: Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message ||
          "Your item has been listed successfully! 🌱"
      );

      setForm({ ...initialForm });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Item add nahi hua. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-item-page">
      {/* Header */}
      <header className="add-item-header">
        <Link to="/dashboard" className="add-item-brand">
          🌿 EcoLoop
        </Link>

        <Link to="/items" className="add-item-back">
          Browse Items →
        </Link>
      </header>

      {/* Form Container */}
      <section className="add-item-container">
        <div className="add-item-intro">
          <span className="add-item-eyebrow">
            SHARE SOMETHING GOOD
          </span>

          <h1>Give your items a new life. ♻️</h1>

          <p>
            Something you no longer need could be exactly what
            someone else is looking for.
          </p>
        </div>

        <form
          className="add-item-form"
          onSubmit={handleSubmit}
        >
          <h2>List an Item</h2>

          <p className="add-item-subtitle">
            Enter the details of the item you want to share.
          </p>

          {/* Success Message */}
          {message && (
            <p className="add-item-success" role="status">
              {message}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="add-item-error" role="alert">
              {error}
            </p>
          )}

          {/* Item Name */}
          <div className="add-item-field">
            <label htmlFor="title">Item Name *</label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Winter Jacket"
              maxLength={100}
              required
            />
          </div>

          {/* Category and Condition */}
          <div className="add-item-form-grid">
            <div className="add-item-field">
              <label htmlFor="category">Category *</label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Home & Kitchen">
                  Home &amp; Kitchen
                </option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="add-item-field">
              <label htmlFor="condition">Condition *</label>

              <select
                id="condition"
                name="condition"
                value={form.condition}
                onChange={handleChange}
                required
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Listing Type */}
            <div className="add-item-field">
              <label htmlFor="type">Listing Type *</label>

              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="Sell">Sell</option>
                <option value="Donate">Donate</option>
                <option value="Exchange">Exchange</option>
              </select>
            </div>

            {/* Price */}
            <div className="add-item-field">
              <label htmlFor="price">Price (₹) *</label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />

              <small>
                Enter 0 for a free donation.
              </small>
            </div>
          </div>

          {/* Location */}
          <div className="add-item-field">
            <label htmlFor="location">Location *</label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Jabalpur"
              required
            />
          </div>

          {/* Description */}
          <div className="add-item-field">
            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item and its condition..."
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className="add-item-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Listing Item..."
              : "🌱 List My Item"}
          </button>

          <p className="add-item-note">
            By sharing an item, you're helping reduce waste.
          </p>
        </form>
      </section>
    </main>
  );
}

export default AddItem;