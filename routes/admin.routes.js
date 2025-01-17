// Assuming you're using Express.js

const express = require('express');
const router = express.Router();
const User = require('../models/User.model'); // Your User model
const Booking = require('../models/Booking.model'); // Your Booking model
const { isAdmin } = require('../middleware/auth.middleware'); // Middleware to check if the user is admin




// Admin endpoint to fetch all users and their bookings
router.get('/users', isAdmin, async (req, res) => {
  try {
    // Fetch all users and their bookings
    const users = await User.find({}, 'name email userType'); // fetch only required fields
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users.', error });
  }
});

module.exports = router;
