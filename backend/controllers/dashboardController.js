const User = require("../models/User");
const Item = require("../models/Item");

// ================= GET DASHBOARD =================

const getDashboard = async (req, res) => {
  try {
    console.log("📊 DASHBOARD API HIT");
    console.log("USER:", req.user);

    // Get logged-in user
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's items
    const items = await Item.find({
      owner: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      ecoStats: {
        ecoPoints: user.ecoPoints,
        itemsReused: user.itemsReused,
        itemsDonated: user.itemsDonated,
        plasticSaved: user.plasticSaved,
        co2Saved: user.co2Saved,
      },

      items: {
        count: items.length,
        data: items,
      },
    });

  } catch (error) {
    console.error("❌ Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};