const NGO = require("../models/NGO");

// ================= GET ALL NGOs =================

const getAllNGOs = async (req, res) => {
  try {
    console.log("🏢 GET ALL NGOs API HIT");

    const ngos = await NGO.find({
      verified: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });

  } catch (error) {
    console.error("❌ Get NGOs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET NGO BY ID =================

const getNGOById = async (req, res) => {
  try {
    console.log("🏢 GET NGO BY ID API HIT");

    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    res.status(200).json({
      success: true,
      ngo,
    });

  } catch (error) {
    console.error("❌ Get NGO Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// ================= CREATE NGO =================

const createNGO = async (req, res) => {
  try {
    console.log("🏢 CREATE NGO API HIT");

    const {
      name,
      description,
      location,
      contact,
      email,
      acceptedCategories,
      verified,
    } = req.body || {};

    if (
      !name ||
      !description ||
      !location ||
      !contact ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const ngo = await NGO.create({
      name,
      description,
      location,
      contact,
      email,
      acceptedCategories:
        acceptedCategories || ["Clothing"],
      verified: verified || false,
    });

    res.status(201).json({
      success: true,
      message: "NGO created successfully",
      ngo,
    });

  } catch (error) {
    console.error("❌ Create NGO Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  getAllNGOs,
    getNGOById,
    createNGO,
};