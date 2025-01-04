const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Booking = require("../models/Booking.model");

// Route to fetch user details
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("userId found:", userId);

  try {
    const user = await User.findById(userId);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the bookings for the user
    const bookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json({ balance: user.balance, bookings: bookings });
    console.log('bookings fetched:', bookings);
  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Route to update the balance

router.put("/update-balance/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(" User id found: ", userId);

    const { amount } = req.body; // amount to add
    console.log("Amount to be added is :", amount);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    const user = await User.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's balance
    user.balance += amount;
    await user.save();

    res.status(200).json({ updatedBalance: user.balance });
    console.log("Balance updated successfully :", user.balance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
