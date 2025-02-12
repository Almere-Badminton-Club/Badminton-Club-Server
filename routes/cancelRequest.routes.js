const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");

// Endpoint to update a booking by ID for cancellation
router.put("/:bookingId/cancel", async (req, res) => {
  const { bookingId } = req.params;
  const { cancelRequest } = req.body;

  try {
    // validate request
    if(!cancelRequest || !cancelRequest.cancelId || cancelRequest.isCanceled === undefined ) {
      return res.status(400).json({ error: "Invalid cancel request data."});
    }

    // find the booking by bookingId
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      res.status(404).json({ error: "Booking not found."});
    }

    // check if the booking is already canceled
    const alreadyCanceled = booking.cancelRequests?.some(
      (request) => request.isCanceled === true
    );
    if (alreadyCanceled) {
      return res.status(400).json({ error: "Booking has already been canceled." });
    }

    // Add the cancellation request to the cancel array
    if(!booking.cancelRequests) {
      booking.cancelRequests = [];
    }
    booking.cancelRequests.push(cancelRequest);

    // save the updated booking document
    await booking.save();
    res.status(200).json({ message: "Cancel the booking request has been successfully submitted.", booking});
  } catch(error) {
console.error("Error updating cancellation request:", error);
res.status(500).json({ error: "An error occured while processing the cancellation request."});
  }
});

// to fetch all canceled: true bookings
router.get("/cancel-queue", async (req, res) => {
  try { 
    const { date } = req.query; // Get the selected date from request

    if (!date) {
      return res.status(400).json({ error: "Date is required." });
    }

    // Convert date string to a proper Date object
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const cancelQueue = await Booking.find({
      "cancelRequests.isCanceled": true,
      bookingDate: { $gte: selectedDate, $lt: new Date(selectedDate.getTime() + 86400000) } // Filter for the selected day
    });

    // Format the response if necessary
    const formattedQueue = cancelQueue.map((booking) => {
      const canceledRequest = booking.cancelRequests.find(
        (request) => request.isCanceled === true
      );
      return {
        bookingId: booking.bookingId,
        userName: booking.userName,
        dayIndex: booking.dayIndex,
        slotIndex: booking.slotIndex,
        bookingDate: booking.bookingDate,
        cancelId: canceledRequest?.cancelId,
        userId: booking.userId,
      };
    });

    res.status(200).json({ cancelQueue: formattedQueue });
  } catch (error) {
    console.error("Error fetching cancel queue:", error);
    res.status(500).json({ error: "Failed to fetch cancel queue." });
  }
});



module.exports = router;
