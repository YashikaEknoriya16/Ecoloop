const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    console.log("🔐 AUTH MIDDLEWARE HIT");

    const authHeader = req.headers.authorization;

    console.log("Authorization:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;