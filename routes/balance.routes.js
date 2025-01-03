const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

// Route to fetch user details
router.get("/:id", async (req, res) => {
  const  userId  = req.params.id;
  console.log("userId found:", userId);

  try {
    const user = await User.findById(userId);
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Route to update the balance

router.put("/update-balance/:id", async (req, res) => {
  try {

  const userId = req.params.id;
  console.log(' User id found: ', userId);

  const { amount } = req.body; // amount to add
  console.log('Amount to be added is :', amount);

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: 'Invalid amount.'})
  }

    const user = await User.findById(userId);
    console.log('User:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's balance
    user.balance += amount;
    await user.save();

    res.status(200).json({ updatedBalance: user.balance });
    console.log("User :", user);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

router.put("/:id/update-balance", async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (typeof amount !== 'number') {
    return res.status(400).json({ message: 'Invalid amount, Must be a number.'});
  }

  try {
    // Find the user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update e wallet balance
    user.balance += amount;

    if (user.balance < 0) {
      return res.status(400).json({ message: 'Insufficient balnace.' });
    }

    await user.save();

    // return updated balance

    res.status(200).json({ message: 'Balance updated successfully.',
  balance: user.balance,
})
  } catch(error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ message: 'internal server error.', error});
  }
})

module.exports = router;
