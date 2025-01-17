const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

console.log({ authenticateUser, isAdmin })
router.get('/users', authenticateUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email userType'); // Customize fields as needed
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

module.exports = router;
