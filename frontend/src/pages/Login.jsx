import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="brand">
          🌿 EcoLoop
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <Link to="/register" className="nav-register">
            Register
          </Link>
        </div>
      </nav>

      <main className="login-layout">
        <section className="login-intro" id="about">
          <span className="eyebrow">SMALL ACTIONS. BIG IMPACT.</span>

          <h1>
            A Greener Tomorrow
            <span> Starts With You.</span>
          </h1>

          <p className="intro-description">
            Join a community that reuses, reduces and creates
            a cleaner, greener planet.
          </p>

          <div className="eco-benefits">
            <div className="benefit">
              <span className="benefit-icon">♻️</span>
              <div>
                <h3>Reduce Waste</h3>
                <p>Give useful items a second life.</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon">🤝</span>
              <div>
                <h3>Build Community</h3>
                <p>Connect and share with others.</p>
              </div>
            </div>

            <div className="benefit">
              <span className="benefit-icon">🌍</span>
              <div>
                <h3>Make an Impact</h3>
                <p>Every small step matters.</p>
              </div>
            </div>
          </div>

          <div className="earth-art" aria-hidden="true">
            🌍<span>🌱</span>
          </div>
        </section>

        <section className="login-card">
          <div className="card-brand">
            <span className="brand-leaf">🌿</span>
            <span>EcoLoop</span>
          </div>

          <p className="brand-tagline">
            Reuse · Recycle · Reimagine
          </p>

          <h2>Welcome Back!</h2>
          <p className="card-description">
            Login to continue your eco-friendly journey.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p role="alert" style={{ color: "#c62828", marginBottom: 16 }}>
                {error}
              </p>
            )}

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="forgot-link">Secure Login</span>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <span>→</span>}
            </button>
          </form>
          <div className="login-divider">
            <span>WELCOME TO A GREENER WORLD</span>
          </div>
          <p className="register-prompt">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </section>
      </main>

      <footer className="login-footer">
        Made for a greener tomorrow <span>♥</span>
      </footer>
    </div>
  );
}
export default Login;