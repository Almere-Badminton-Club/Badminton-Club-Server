const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const { isValidObjectId } = require('mongoose');

// API endpoint for booking a seat
router.post('/book', (req, res, next) => {
  const { userId, seatId, bookingDate } = req.body;

  // Validate user ID, seat ID, and booking date
  if (!isValidObjectId(userId) || !isValidObjectId(seatId) || !bookingDate) {
    return res.status(400).json({ message: 'Invalid user ID, seat ID, or booking date.' });
  }

  // Create a new booking
  Booking.create({ user_id: userId, seat_id: seatId, booking_date: bookingDate })
    .then(createdBooking => {
      res.status(201).json({ booking: createdBooking });
    })
    .catch(error => {
      next(error);
    });
});

// API endpoint for canceling a booking
router.delete('/cancel/:bookingId', (req, res, next) => {
  const { bookingId } = req.params;

  // Validate booking ID
  if (!isValidObjectId(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking ID.' });
  }

  // Find and delete the booking
  Booking.findByIdAndDelete(bookingId)
    .then(deletedBooking => {
      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found.' });
      }
      res.status(200).json({ message: 'Booking canceled successfully.' });
    })
    .catch(error => {
      next(error);
    });
});

// API endpoint for retrieving bookings for a specific user
router.get('/user/:userId', (req, res, next) => {
  const { userId } = req.params;

  // Validate user ID
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  // Find bookings for the specified user
  Booking.find({ user_id: userId })
    .then(bookings => {
      res.status(200).json({ bookings });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
