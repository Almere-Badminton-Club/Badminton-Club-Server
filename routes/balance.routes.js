const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

// Route to fetch user details
router.get('/:userId', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error('Error fetching User:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});



// Route to update the balance

router.put("/update-balance/:userId", async (req, res) => {
  const  userId  = req.params.id;
  const { amount } = req.body; // amount to add

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User :", user);

    // Update the user's balance
    user.balance += amount;
    await user.save();

    res.status(200).json({ updatedBalance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;