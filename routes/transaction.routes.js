const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Get transactions for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ amountCreditDate: -1 }) // Sort by latest transactions first
      .lean();

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
