const Item = require("../models/Item");
const User = require("../models/User");
// ================= ADD ITEM =================

const createItem = async (req, res) => {
  try {
    console.log("🌱 CREATE ITEM API HIT");
    console.log("USER:", req.user);

    const {
      title,
      description,
      category,
      condition,
      type,
      price,
      image,
      location,
      plasticSaved,
      co2Saved,
    } = req.body || {};

    // Check required fields
    if (
      !title ||
      !description ||
      !category ||
      !condition ||
      !type ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Price validation
    if (type === "Sell" && (!price || price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0 for selling items",
      });
    }

    // Create item
    const item = await Item.create({
      title,
      description,
      category,
      condition,
      type,
      price: type === "Sell" ? price : 0,
      image: image || "",
      location,
      ecoImpact: {
        plasticSaved: plasticSaved || 0,
        co2Saved: co2Saved || 0,
      },
      owner: req.user.userId,
    });

    // ================= ECO POINTS =================
// ================= ECO POINTS =================
const user = await User.findById(req.user.userId);

if (user) {

  // Exchange and Sell give points immediately
  if (type === "Exchange") {
    user.ecoPoints += 15;
    user.itemsReused += 1;

    user.plasticSaved += plasticSaved || 0;
    user.co2Saved += co2Saved || 0;

  } else if (type === "Sell") {
    user.ecoPoints += 10;

    user.plasticSaved += plasticSaved || 0;
    user.co2Saved += co2Saved || 0;
  }

  // Donate:
  // Eco points and impact will be added only
  // after NGO donation is completed.

  await user.save();
}

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      item,
    });

  } catch (error) {
    console.error("❌ Create Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET ALL ITEMS =================
// ================= GET ALL ITEMS + SEARCH & FILTER =================

const getAllItems = async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      location,
      condition,
    } = req.query;

    // Only available items
    const filter = {
      status: "Available",
    };

    // Search by title or description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Location filter
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Condition filter
    if (condition) {
      filter.condition = condition;
    }

    const items = await Item.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });

  } catch (error) {
    console.error("❌ Get Items Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET ITEM BY ID =================

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("owner", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });

  } catch (error) {
    console.error("❌ Get Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// ================= UPDATE ITEM =================

const updateItem = async (req, res) => {
  try {
    console.log("✏️ UPDATE ITEM API HIT");
    console.log("USER:", req.user);

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check item owner
    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this item",
      });
    }

    const {
      title,
      description,
      category,
      condition,
      type,
      price,
      image,
      location,
      plasticSaved,
      co2Saved,
      status,
    } = req.body || {};

    // Update only provided fields
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (condition !== undefined) item.condition = condition;
    if (type !== undefined) item.type = type;
    if (price !== undefined) item.price = price;
    if (image !== undefined) item.image = image;
    if (location !== undefined) item.location = location;
    if (status !== undefined) item.status = status;

    if (plasticSaved !== undefined) {
      item.ecoImpact.plasticSaved = plasticSaved;
    }

    if (co2Saved !== undefined) {
      item.ecoImpact.co2Saved = co2Saved;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });

  } catch (error) {
    console.error("❌ Update Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// ================= DELETE ITEM =================

const deleteItem = async (req, res) => {
  try {
    console.log("🗑️ DELETE ITEM API HIT");
    console.log("USER:", req.user);

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check item owner
    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this item",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET MY ITEMS =================

const getMyItems = async (req, res) => {
  try {
    console.log("📦 GET MY ITEMS API HIT");
    console.log("USER:", req.user);

    const items = await Item.find({
      owner: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });

  } catch (error) {
    console.error("❌ Get My Items Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
    getAllItems,
    getItemById,
    getMyItems,
    updateItem,
    deleteItem,
};