const express = require('express');
const router = express.Router();
const CancelRequest = require('../models/CancelRequest.model'); 
const Booking = require('../models/Booking.model');

// Endpoint to add a cancellation request
router.put('/:bookingId/cancel', async (req, res) => {
  const { userId, bookingId, cancelId } = req.body;

  try {
    // Find the booking by bookingId
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Add the cancel request to the booking
    booking.cancelRequests.push({ cancelId }); // Assuming cancelId is an ObjectId
    await booking.save(); // Save the updated booking

    res.status(200).json({ message: 'Cancellation request added successfully', booking });
  } catch (error) {
    console.error('Error adding cancellation request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
