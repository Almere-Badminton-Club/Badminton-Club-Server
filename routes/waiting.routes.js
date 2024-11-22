const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");

// Endpoint to update a booking by ID for Waiting list
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      userName,
      dayIndex,
      slotIndex,
      isWaitingUser,
      bookingDate,
    } = req.body;

    // Validate required fields
    if (!userId || !userName || dayIndex === undefined || slotIndex === undefined || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    //create a new booking document
    const newBooking = new Booking({
      userId,
      userName,
      dayIndex,
      slotIndex,
      isWaitingUser: isWaitingUser !== undefined ? isWaitingUser : false,
      bookingDate,
    });

    // Save the booking in db

    await newBooking.save();
    console.log("newBooking is:", newBooking);
    res.status(200).json({ success: true, booking: newBooking, message: 'Booking created successfully.' });
  } catch (error) {
    console.error("Error creating booking.", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking.", error: error.message });
  }
});

module.exports = router;
