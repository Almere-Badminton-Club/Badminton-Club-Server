const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Seat = require('../models/Seat.model');
const { ObjectId } = mongoose.Types;

// Generate unique booking ID
const generateUniqueBookingId = async () => {
  let bookingId;
  do {
    bookingId = new ObjectId().toString(); // Convert ObjectId to string
    console.log("Generated booking ID:", bookingId);

    // Check if booking with the same ID exists
    const existingBooking = await Booking.findOne({ bookingId });
    if (!existingBooking) {
      break; // Unique ID found
    }
  } while (true);
  return bookingId;
};

// Endpoint to fetch all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new booking
router.post('/', async (req, res) => {
  try {
    const { userId, seatId, bookingDate } = req.body;

    // Validate required data
    if (!userId || !seatId || !bookingDate ) {
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

    // Generate a unique booking ID
    const bookingId = await generateUniqueBookingId();
    console.log("Booking ID to be saved:", bookingId);

    // Create new booking
    const booking = new Booking({
      bookingId,
      userId,
      seatId,
      bookingDate,
      
    });

    // Save booking to database
    const savedBooking = await booking.save();
    console.log("Booking saved:", savedBooking);

    res.status(201).json({ message: 'Booking created successfully.', booking: savedBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a booking by ID
router.delete('/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Specified ID is not valid' });
    }

    const booking = await Booking.findOneAndDelete({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: `Booking with ID ${bookingId} was removed successfully.` });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
