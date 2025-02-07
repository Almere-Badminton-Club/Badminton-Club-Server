const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");

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
      res.status(200).json({ message: "Booking replaced successfully", booking });
    } catch (error) {
      console.error("Error replacing booking:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;