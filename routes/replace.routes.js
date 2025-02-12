const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");
const Transaction = require("../models/Transaction.model");
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

    // Find the C1
    const canceledBooking = await Booking.findOne({ bookingId: bookingId });
    if (!canceledBooking) {
      return res.status(404).json({ message: "Canceled booking not found" });
    }

    const C1UserId = canceledBooking.userId;

    // update the canceled booking with W1's details

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
    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: bookingId }, // Query explicitly by booking id
      {
        $set: updatedFields, // Replace with new data
      },
      {
        new: true, // return the updated document
        arrayFilters: [{ "elem.cancelId": "C1" }], // Match the specific cancelId
      }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Refund €4 to C1 and create a transaction entry
    const refundAmount = 4;

    // Update C1's balance in the User model
    await User.findByIdAndUpdate(C1UserId, { $inc: { balance: refundAmount } });

    // Create a refund transaction for C1
    const refundTransaction = new Transaction({
      userId: C1UserId,
      amountCredited: refundAmount,
      transactionType: "credit",
      amountCreditDate: new Date(),
      replacedBookingDate: canceledBooking.bookingDate,
    });

    await refundTransaction.save(); // Save transaction in DB

    console.log("Refund entry added for C1:", refundTransaction);

    res
      .status(200)
      .json({
        message: "Booking replaced successfully, refund added for C1",
        updatedBooking,
      });
  } catch (error) {
    console.error("Error replacing booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
