const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Seat = require('../models/Seat.model');
const CancelRequest = require('../models/CancelRequest.model');
const { ObjectId } = mongoose.Types;

// Generate unique booking ID
const generateUniqueBookingId = async () => {
  let bookingId;
  do {
    bookingId = new ObjectId().toString(); // Convert ObjectId to string
    const existingBooking = await Booking.findOne({ bookingId });
    if (!existingBooking) {
      break; // Unique ID found
    }
  } while (true);
  return bookingId;
};

// Endpoint to fetch bookings by date
router.get('/', async (req, res) => {
  const  {date}  = req.query;  
  console.log("Received date query parameter:", date);

  try {
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    // Convert date string to Date object
    const bookingDate = new Date(date);
    console.log("Parsed booking date", bookingDate);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Fetch bookings for the specified date
    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Start of the day:", startOfDay);
    console.log("End of day:", endOfDay);

    const bookings = await Booking.find({
      bookingDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found for the given date." );
      return res.status(404).json({ message: 'No biikings found for the given date'});
    }
    console.log("Fetched bookings", bookings);

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Endpoint to create a new booking
router.post('/', async (req, res) => {
  try {
    const { userId, seatId, bookingDate, dayIndex, slotIndex, userName} = req.body;

    console.log('Incoming Request:', req.body);

    // Validate required data
    if (!userId || !seatId || !bookingDate || dayIndex === undefined || slotIndex === undefined || !userName) {
      console.log('validation Failed: Missing required data');
      return res.status(400).json({ message: 'Missing required data in request body.' });
    }

    // Parse bookingDate into a date object
    const parsedBookingDate = new Date(bookingDate);

    // Check if the parsed date is valid
    if (isNaN(parsedBookingDate)) {
      return res.status(400).json({ message: 'Invalid booking date format.' });
    }

    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('Validation Failed: User not found');
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if seat exists
    const seat = await Seat.findById(seatId);
    if (!seatId) {                          // Here seatId is important
      console.log('Validation Failed: Seat not found');
      return res.status(404).json({ message: 'Seat not found.' });
    }

    // Convert bookingDate to start of the day for comparison
    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    console.log('Converted Booking Date to start of day:', startOfDay);


    // Check if user has already booked a slot on the same day
    const existingBooking = await Booking.findOne({
      userId,
      seatId,
      bookingDate: new Date().toISOString(),
      dayIndex,
      slotIndex,
      userName
    });
    console.log('Existing Booking:', existingBooking);

    // if (existingBooking) {
    //   console.log('Validation Failed: User has already booked this slot on this day');
    //   return res.status(400).json({ message: 'User has already booked a slot on this day.' });
    // }

    // Generate a unique booking ID
    const bookingId = await generateUniqueBookingId();

    // Create new booking
    const booking = new Booking({
      bookingId,
      userId,
      seatId,
      bookingDate: startOfDay,
      dayIndex,
      slotIndex,
      userName,
      cancelRequest: []
    });

    // Save booking to database
    const savedBooking = await booking.save();
    console.log('Booking Created Successfully.', booking, savedBooking);
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
 