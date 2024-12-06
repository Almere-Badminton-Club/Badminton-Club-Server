const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");

// Replace C1 with W1
router.put("/:bookingId/replace", async (req, res) => {
  const { bookingId } = req.params;
  const { userId, userName, isWaitingUser, isCanceled } = req.body;

  try {
    //Validate bookingId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }
    // Validate input data
    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: "userId and userName are required.",
      });
    }

    // find the booking to be replaced
    const canceledBooking = await Booking.findById(bookingId);

    if (!canceledBooking) {
      return res.status(404).json({
        success: false,
        message: "Canceled booking not found.",
      });
    }

    // Validate canceled booking
    if (!canceledBooking.isCanceled) {
      return res.status(404).json({
        success: false,
        message: "This booking is not marked as canceled",
      });
    }

    // Find the waiting user's booking
    const waitingUserBooking = await Booking.findOne({
      userId: userId,
      isWaitingUser: true,
    });

    if (!waitingUserBooking ) {
      return res.status(400).json({
        success: false,
        message: 'Waiting user booking not found',
      })
    }
    // Update the canceled booking with waiting user's details
    canceledBooking.userId = waitingUserBooking.userId;
    canceledBooking.userName = waitingUserBooking.userName;
    canceledBooking.isCanceled = false;
    canceledBooking.isWaitingUser = false;

    // save the updated booking
    const updatedBooking = await canceledBooking.save();
    console.log("Updated canceled booking :", updatedBooking);

    // Remove the waiting user's booking from the database
    await Booking.deleteOne({ _id: waitingUserBooking._id});

    return res.status(200).json({
      success: true,
      message: "Booking replaced successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error replacing booking:", error);
    res.status(500).json({
      success: false,
      mesage: "Internal server error.",
    });
  }
});
module.exports = router;
