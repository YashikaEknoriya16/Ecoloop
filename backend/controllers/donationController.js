const DonationRequest = require("../models/DonationRequest");
const Item = require("../models/Item");
const NGO = require("../models/NGO");

// ================= CREATE DONATION REQUEST =================

const createDonationRequest = async (req, res) => {
  try {
    console.log("🤝 CREATE DONATION REQUEST API HIT");
    console.log("USER:", req.user);

    const { itemId, ngoId, message } = req.body || {};

    if (!itemId || !ngoId) {
      return res.status(400).json({
        success: false,
        message: "Item and NGO are required",
      });
    }

    // Check item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only item owner can donate
    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only donate your own item",
      });
    }

    // Item must be Clothing
    if (item.category !== "Clothing") {
      return res.status(400).json({
        success: false,
        message: "Only clothing items can be donated to NGOs",
      });
    }

    // Item must be available
    if (item.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This item is not available",
      });
    }

    // Check NGO
    const ngo = await NGO.findById(ngoId);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    // NGO must be verified
    if (!ngo.verified) {
      return res.status(400).json({
        success: false,
        message: "This NGO is not verified",
      });
    }

    // Check whether NGO accepts clothing
    if (!ngo.acceptedCategories.includes("Clothing")) {
      return res.status(400).json({
        success: false,
        message: "This NGO does not accept clothing",
      });
    }

    // Create donation request
    const donationRequest = await DonationRequest.create({
      user: req.user.userId,
      item: itemId,
      ngo: ngoId,
      message: message || "",
    });

    res.status(201).json({
      success: true,
      message: "Donation request created successfully",
      donationRequest,
    });

  } catch (error) {
    console.error("❌ Create Donation Request Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ================= GET MY DONATION REQUESTS =================

const getMyDonationRequests = async (req, res) => {
  try {
    console.log("📦 GET MY DONATION REQUESTS API HIT");

    const requests = await DonationRequest.find({
      user: req.user.userId,
    })
      .populate("item")
      .populate("ngo", "name location contact email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("❌ Get Donation Requests Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET ALL DONATION REQUESTS =================

const getAllDonationRequests = async (req, res) => {
  try {
    console.log("📋 GET ALL DONATION REQUESTS API HIT");

    const requests = await DonationRequest.find()
      .populate("user", "name email")
      .populate("item")
      .populate("ngo", "name location contact email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error("❌ Get All Donation Requests Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= ACCEPT DONATION REQUEST =================

const acceptDonationRequest = async (req, res) => {
  try {
    console.log("✅ ACCEPT DONATION REQUEST API HIT");

    const request = await DonationRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Donation request not found",
      });
    }

    // Request must be pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This donation request is already processed",
      });
    }

    // Update request status
    request.status = "Accepted";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Donation request accepted successfully",
      donationRequest: request,
    });

  } catch (error) {
    console.error("❌ Accept Donation Request Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= COMPLETE DONATION REQUEST =================

const completeDonationRequest = async (req, res) => {
  try {
    console.log("🎉 COMPLETE DONATION REQUEST API HIT");

    const request = await DonationRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Donation request not found",
      });
    }

    // Donation must be accepted first
    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Donation must be accepted before completion",
      });
    }

    // Find item
    const item = await Item.findById(request.item);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Find user
    const user = await require("../models/User").findById(
      request.user
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= UPDATE DONATION =================

    request.status = "Completed";

    // ================= UPDATE ITEM =================

    item.status = "Donated";

    // ================= UPDATE ECO STATS =================

    user.ecoPoints += 20;
    user.itemsDonated += 1;

    user.plasticSaved += item.ecoImpact.plasticSaved || 0;
    user.co2Saved += item.ecoImpact.co2Saved || 0;

    await request.save();
    await item.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Donation completed successfully",
      donationRequest: request,
      item: {
        id: item._id,
        status: item.status,
      },
      ecoStats: {
        ecoPoints: user.ecoPoints,
        itemsDonated: user.itemsDonated,
        plasticSaved: user.plasticSaved,
        co2Saved: user.co2Saved,
      },
    });

  } catch (error) {
    console.error("❌ Complete Donation Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createDonationRequest,
  getMyDonationRequests,
  getAllDonationRequests,
  acceptDonationRequest,
  completeDonationRequest,
};