
const User = require("../models/User");

// ================= ECO LEADERBOARD =================

const getLeaderboard = async (req, res) => {
  try {
    console.log("🏆 LEADERBOARD API HIT");

    const users = await User.find({
    })
      .select(
        "name ecoPoints itemsReused itemsDonated plasticSaved co2Saved"
      )
      .sort({ ecoPoints: -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      ecoPoints: user.ecoPoints || 0,
      itemsReused: user.itemsReused || 0,
      itemsDonated: user.itemsDonated || 0,
      plasticSaved: user.plasticSaved || 0,
      co2Saved: user.co2Saved || 0,
    }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    console.error("❌ Leaderboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};
