const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');

// GET /api/seats/availability
router.get('/availability', (req, res, next) => {
  const { date } = req.query;

  // Check if date parameter is provided
  if (!date) {
    return res.status(400).json({ message: 'Date parameter is required.' });
  }

  // Parse the date string into a JavaScript Date object
  const targetDate = new Date(date);

  // Check if the date is valid
  if (isNaN(targetDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date format.' });
  }

  // Query the database to find available seats for the specified date
  Booking.find({ booking_date: targetDate })
    .then(bookings => {
      // Assuming total number of seats is fixed
      const totalSeats = 20;
      const bookedSeats = bookings.length;
      const availableSeats = totalSeats - bookedSeats;

      res.status(200).json({ date: targetDate, availableSeats });
    })
    .catch(error => {
      next(error);
    });
});

// Other seat-related routes can be added here...

module.exports = router;
