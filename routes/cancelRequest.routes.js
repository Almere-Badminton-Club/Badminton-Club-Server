const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');

// Endpoint to update a booking by ID for cancellation
router.put("/:bookingId/cancel", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancelRequest } = req.body;

    console.log("req.body for cancel request", req.body);

    const booking = await Booking.findOne({ bookingId });
      
    if(booking.cancelRequests.some((cancel) => cancel.cancelId === cancelRequest.cancelId)) {
      return res.status(400).json({ message: 'This cancel request already exist'});
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      { bookingId },
      {
        $push: { cancelRequests: cancelRequest },
        $set: {
          isCanceled: cancelRequest.isCanceled
            ? `${req.body.userName}`
            : req.body.userName,
        },
      },
      { new: true }
    );
    
    

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking canceled", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});



module.exports = router;
