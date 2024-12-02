const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");

// Endpoint to update a booking by ID for Waiting list
router.post("/", async (req, res) => {
  try {
    const { userId, userName, dayIndex, slotIndex, bookingDate } = req.body;

    // Validate required fields
    if (
      !userId ||
      !userName ||
      dayIndex === undefined ||
      slotIndex === undefined ||
      !bookingDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Check if the slotIndex is valid (0-24)
    if (slotIndex < 0 || slotIndex > 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot index. Should be between 0 and 24.",
      });
    }

    // if slotindex is 20 or higher, its a waiting slot
    if (slotIndex >= 20) {
      // Check if there are any waiting slot
      const waitingBookings = await Booking.find({
        bookingDate,
        dayIndex,
        slotIndex: { $gte: 20, $lte: 24 },
        userId: { $exists: true }, // check if user is assigned
      });
      if (waitingBookings.length >= 5) {
        return res.status(400).json({
          success: false,
          message:
            "Waiting list is full. Cannot add more users to waiting list.",
        });
      }

      // Create and save new waiting list booking
      const newWaitingBooking = new Booking({
        userId,
        userName,
        dayIndex,
        slotIndex,
        bookingDate,
        isWaitingUser: true,
      });

      //save the waiting list booking
      await newWaitingBooking.save();
      res.status(200).json({
        success: true,
        booking: newWaitingBooking,
        message: 'Booking created successfully in the waiting list.',
      });
    } 
  } catch (error) {
    console.error("Error creating booking.", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create booking.",
        error: error.message,
      });
  }
});

module.exports = router;
