const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Transaction = require("../models/Transaction.model");

// Get transactions for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if ( !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format"});
    }

    const transactions = await Transaction.find({ userId })
      .sort({ amountCreditDate: -1 }) // Sort by latest transactions first
      .lean();

    res.json(transactions);
    console.log('Transactions found:', transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
