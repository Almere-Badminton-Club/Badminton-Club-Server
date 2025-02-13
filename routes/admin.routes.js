const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const { authenticateUser, isAdmin } = require('../middleware/auth.middleware');

console.log({ authenticateUser, isAdmin })
router.get('/users', authenticateUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email userType balance'); // Customize fields as needed
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Update user balance (only accessible by admin)
router.patch("/users/:userId", authenticateUser, isAdmin, async (req, res) => {
  try {
    const { balance } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Save the old balance to calculate the credit amount
    const oldBalance = user.balance;

    // Update the user's balance
    user.balance = balance;
    await user.save();

    // Log the manual credit transaction
    const newTransaction = new Transaction({
      userId: user._id,
      amountCredited: balance - oldBalance,
      amountDeducted: 0,
      transactionType: 'credit',
      isManualCredit: true,
      amountCreditDate: new Date(),
    });
    await newTransaction.save();

    res.status(200).json({ message: 'User balance updated successfully', balance: user.balance });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Error updating user balance.'});
    }
});

module.exports = router;
