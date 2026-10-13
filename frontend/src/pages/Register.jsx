
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      const result = response.data;

      setSuccess(result.message || "Registration successful!");

      // Automatically log in if the backend returns a token.
      if (result.token) {
        localStorage.setItem("token", result.token);

        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem(
            "userId",
            result.user._id || result.user.id || ""
          );
        }

        navigate("/dashboard");
      } else {
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <Link to="/" style={styles.brand}>
          🌿 EcoLoop
        </Link>

        <h1 style={styles.heading}>Create Account</h1>
        <p style={styles.subtitle}>
          Join EcoLoop and make a greener difference 🌱
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <label htmlFor="name" style={styles.label}>Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
          style={styles.input}
        />

        <label htmlFor="email" style={styles.label}>Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={6}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#f3f8f1",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    boxSizing: "border-box",
    padding: "36px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 12px 40px rgba(30, 80, 45, 0.12)",
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    color: "#217849",
    fontWeight: "bold",
    fontSize: "22px",
    textDecoration: "none",
    textAlign: "center",
    marginBottom: "20px",
  },
  heading: {
    textAlign: "center",
    color: "#204d35",
    margin: "0 0 10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#718174",
    marginBottom: "24px",
    lineHeight: 1.5,
  },
  label: {
    color: "#304b39",
    fontWeight: "600",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    marginBottom: "18px",
    border: "1px solid #d6e3d7",
    borderRadius: "9px",
    fontSize: "15px",
    outlineColor: "#27804f",
  },
  button: {
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#267b4c",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    padding: "10px",
    background: "#fff0f0",
    color: "#b42318",
    borderRadius: "7px",
  },
  success: {
    padding: "10px",
    background: "#edf9ef",
    color: "#217849",
    borderRadius: "7px",
  },
  footer: {
    textAlign: "center",
    color: "#66766a",
    marginTop: "22px",
    marginBottom: 0,
  },
};

export default Register;
