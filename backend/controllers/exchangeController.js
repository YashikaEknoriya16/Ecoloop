const Exchange = require("../models/Exchange");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
// ================= CREATE EXCHANGE REQUEST =================

const createExchangeRequest = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    const requesterId = req.user.userId;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (String(item.owner) === String(requesterId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot request an exchange for your own item",
      });
    }

    if (item.type !== "Exchange") {
      return res.status(400).json({
        success: false,
        message: "This item is not available for exchange",
      });
    }

    if (item.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available",
      });
    }

    const existingRequest = await Exchange.findOne({
      requester: requesterId,
      item: itemId,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request for this item",
      });
    }

    const exchange = await Exchange.create({
      requester: requesterId,
      item: itemId,
      owner: item.owner,
      message: message || "",
    });

    // Create a notification for the item owner about the new exchange request
await Notification.create({
  recipient: exchange.owner,
  sender: exchange.requester,
  title: "New Exchange Request",
  message: "Someone has requested an exchange for your item.",
  type: "ExchangeRequest",
  relatedExchange: exchange._id,
});

    return res.status(201).json({
      success: true,
      message: "Exchange request sent successfully",
      exchange,
    });
  } catch (error) {
    console.error("Create exchange request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= MY EXCHANGE REQUESTS =================

const getMyExchangeRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await Exchange.find({
      $or: [{ requester: userId }, { owner: userId }],
    })
      .populate("requester", "name email")
      .populate("owner", "name email")
      .populate("item", "title category image type status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get exchange requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const acceptExchangeRequest = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: "Exchange request not found",
      });
    }

    if (String(exchange.owner) !== String(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the item owner can accept this request",
      });
    }

    if (exchange.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer pending",
      });
    }

    const item = await Item.findById(exchange.item);

    if (!item || item.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available",
      });
    }

    // Accept this request.
    exchange.status = "Accepted";
    await exchange.save();

    // Prevent other pending requests for the same item.
    await Exchange.updateMany(
      {
        item: exchange.item,
        _id: { $ne: exchange._id },
        status: "Pending",
      },
      { $set: { status: "Rejected" } }
    );

    return res.status(200).json({
      success: true,
      message: "Exchange request accepted successfully",
      exchange,
    });
  } catch (error) {
    console.error("Accept exchange error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const rejectExchangeRequest = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: "Exchange request not found",
      });
    }

    if (String(exchange.owner) !== String(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "Only the item owner can reject this request",
      });
    }

    if (exchange.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be rejected",
      });
    }

    exchange.status = "Rejected";
    await exchange.save();

    return res.status(200).json({
      success: true,
      message: "Exchange request rejected",
      exchange,
    });
  } catch (error) {
    console.error("Reject exchange error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const completeExchangeRequest = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: "Exchange request not found",
      });
    }

    const userId = String(req.user.userId);
    const isOwner = String(exchange.owner) === userId;
    const isRequester = String(exchange.requester) === userId;

    if (!isOwner && !isRequester) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this exchange",
      });
    }

    if (exchange.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted exchanges can be completed",
      });
    }

    const item = await Item.findById(exchange.item);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Item is no longer available. Another exchange may already be completed.",
      });
    }

    // Complete this exchange and mark the item as exchanged.
    exchange.status = "Completed";
    item.status = "Exchanged";

    await exchange.save();
    await item.save();

    // Reject any other pending or accepted requests for this item.
    await Exchange.updateMany(
      {
        item: exchange.item,
        _id: { $ne: exchange._id },
        status: { $in: ["Pending", "Accepted"] },
      },
      {
        $set: { status: "Rejected" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Exchange completed successfully",
      exchange,
    });
  } catch (error) {
    console.error("Complete exchange error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createExchangeRequest,
    getMyExchangeRequests,
    acceptExchangeRequest,
    rejectExchangeRequest,
    completeExchangeRequest,
};
