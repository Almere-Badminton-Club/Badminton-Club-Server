const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");

// Replace canceled booking (C1) with waiting booking (W1)
router.put("/:bookingId/replace", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId, userName, isCanceled, replacedBookingDate } = req.body;

    console.log("Replacing booking for bookingId:", bookingId);
    console.log("Request body for replaced booking:", req.body);

    // Validate required fields
    if (!userId || !userName) {
      return res.status(400).json({
        message: " Missing Required fields.",
      });
    }

    // find the existing C1 booking
    const existingBooking = await Booking.findOne({ bookingId });
    if (!existingBooking) {
      return res
        .status(404)
        .json({ message: "Original booking (C1) not found." });
    }

    // preserve the booking date of C1
    const originalBookingDate = existingBooking.bookingDate;

    // update the specified fields
    const updatedFields = {
      userId,
      userName,
      isWaitingUser: false,
      cancelId: "",
      replacedBookingDate: replacedBookingDate || null,
      "cancelRequests.$[elem].isCanceled": isCanceled,
    };
    console.log("updated fields  for canceled booking are:", updatedFields);

    // Find and update the booking by bookingId (not _id)
    const booking = await Booking.findOneAndUpdate(
      { bookingId: bookingId }, // Query explicitly by booking id
      {
        $set: updatedFields, // Replace with new data
      },
      {
        new: true, // return the updated document
        arrayFilters: [{ "elem.cancelId": "C1" }], // Match the specific cancelId
      }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update C1's wallet entry instead of deleting
    const C1User = await User.findById(existingBooking.userId);
    if (C1User) {
      const walletEntry = C1User.bookings.find(
        (b) => b.bookingId === bookingId
      );

      if (walletEntry) {
        walletEntry.amountCredited = 4;
        walletEntry.amountDeducted = 4;
        walletEntry.replacedBookingDate =
          replacedBookingDate || originalBookingDate;
      } else {
        C1User.bookings.push({
          bookingId,
          bookingDate: originalBookingDate,
          amountCredited: 4,
          amountDeducted: 4,
          replacedBookingDate: replacedBookingDate || originalBookingDate,
          isManualCredit: false,
        });
      }
      await C1User.save();
    }

    res.status(200).json({
      message: "Booking replaced successfully",
      updatedBooking: booking,
      C1Wallet: C1User ? C1User.bookings : [],
    });
  } catch (error) {
    console.error("Error replacing booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
