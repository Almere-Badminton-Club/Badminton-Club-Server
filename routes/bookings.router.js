const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Seat = require('../models/Seat.model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Generate unique booking ID
const generateUniqueBookingId = async () => {
  let bookingId;
  do {
    bookingId = new ObjectId().toString(); // convert Objectid to string
    console.log("Generated booking ID:", bookingId);

    // Check if booking with same ID exists
    const existingBooking = await Booking.findOne({ bookingId });
    if (!existingBooking) {
      break; // Unique ID found
    }
  } while (true);
  return bookingId;
};


// Endpoint to fetch booking data
router.get('/', async (req, res) => {
  try {
    // Fetch all bookings from the database
    const bookings = await Booking.find();
    // Send the bookings data as JSON response
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to create a new booking
router.post('/', async (req, res) => {
  try {
    // Extract necessary data from request body
    const { userId, seatId, bookingDate } = req.body;

    // Validate required data
    if (!userId || !seatId || !bookingDate) {
      return res.status(400).json({ message: 'Missing required data in request body.' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if seat exists
    const seat = await Seat.findById(seatId);
    if (!seatId) {
      return res.status(404).json({ message: 'Seat not found.' });
    }

    // Generate a unique booking ID using MongoDB's ObjectId
    const bookingId = await generateUniqueBookingId();

    console.log(bookingId);

    // Create new booking
    const booking = new Booking({
      bookingId,
      userId,
      seatId,
      bookingDate
    });

    console.log(Booking);

    // Save booking to database
    const savedBooking = await booking.save();
    console.log("I am here...",savedBooking);


    // Respond with success message and created booking
    res.status(201).json({ message: 'Booking created successfully.', booking: savedBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
