const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const donationRoutes = require("./routes/donationRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/exchanges", exchangeRoutes);

app.use("/api/notifications", notificationRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌱 Welcome to EcoLoop API",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EcoLoop server running on port ${PORT}`);
});