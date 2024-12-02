const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Seat = require("../models/Seat.model");
const CancelRequest = require("../models/CancelRequest.model");
const { ObjectId } = mongoose.Types;
const { convertToCET } = require("../utils/timeUtils");

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
router.get("/", async (req, res) => {
  const date = req.query.date;

  try {
    const convertedDate = convertToCET(date);
    // Extract the date from the query parameters
    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required " });
    }
    console.log("Received date:", date);

    // Parse the date and calculate the start & end of the day
    const parsedDate = convertToCET(date);

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    console.log("Start of day:", startOfDay);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 99, 99, 999);
    console.log("End of day:", endOfDay);

    // Fetch bookings within the specified date range
    const bookings = await Booking.find({
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      dayIndex: { $ne: 3 },
    });
    console.log("Fetched bookings:", bookings);

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found for the given date.");
    }

    console.log("Bookings fetched for the date range----:", bookings);

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to create a new booking
router.post("/", async (req, res) => {
  try {
    const { userId, seatId, bookingDate, dayIndex, slotIndex, userName } = req.body;

    console.log("Incoming Request:", req.body);

    // Validate required data
    if (
      !userId ||
      !seatId ||
      !bookingDate ||
      dayIndex === undefined ||
      slotIndex === undefined ||
      !userName
    ) {
      return res.status(400).json({ message: "Missing required data in request body." });
    }

    // Check if the parsed date is valid
    const parsedBookingDate = new Date(bookingDate);
    if (isNaN(parsedBookingDate)) {
      return res.status(400).json({ message: "Invalid booking date format." });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("Validation Failed: User not found");
      return res.status(404).json({ message: "User not found." });
    }

    // Check if seat exists
    const seat = await Seat.findById(seatId);
    if (!seat) {
      console.log("Validation Failed: Seat not found");
      return res.status(404).json({ message: "Seat not found." });
    }

    // Determine if this is a waiting list booking or a regular booking
    let booking;
    if (slotIndex >= 20) {
      // Check if the waiting list has reached the max capacity (5 users)
      const waitingBookings = await Booking.find({
        bookingDate: parsedBookingDate,
        dayIndex: dayIndex,
        slotIndex: { $gte: 20 }, // Only check waiting slots
        isWaitingUser: true,
      });
      
      if (waitingBookings.length >= 5) {
        return res.status(400).json({
          message: "Waiting list is full. Cannot add more users to the waiting list.",
        });
      }

      // Create waiting list booking
      booking = new Booking({
        bookingId: await generateUniqueBookingId(),
        userId,
        seatId,
        bookingDate: parsedBookingDate,
        dayIndex,
        slotIndex,
        userName,
        isWaitingUser: true, // Mark as waiting list
        cancelRequests: [],
      });
      await booking.save();
      return res.status(201).json({ message: "Added to waiting list", booking });
    } else {
      // Check if there are any available regular slots (slotIndex < 20)
      const regularBookings = await Booking.find({
        seatId,
        bookingDate: parsedBookingDate,
        dayIndex,
        slotIndex: { $lt: 20 }, // Only check regular slots
      });

      if (regularBookings.length >= 20) {
        // All regular slots are full, so treat this as a waiting list booking
        booking = new Booking({
          bookingId: await generateUniqueBookingId(),
          userId,
          seatId,
          bookingDate: parsedBookingDate,
          dayIndex,
          slotIndex,
          userName,
          isWaitingUser: true, // Mark as waiting list
          cancelRequests: [],
        });
        await booking.save();
        return res.status(201).json({ message: "Added to waiting list", booking });
      } else {
        // Create a regular booking if slots are available
        booking = new Booking({
          bookingId: await generateUniqueBookingId(),
          userId,
          seatId,
          bookingDate: parsedBookingDate,
          dayIndex,
          slotIndex,
          userName,
          isWaitingUser: false, // Regular booking
          cancelRequests: [],
        });
        await booking.save();
        return res.status(201).json({ message: "Booking created successfully.", booking });
      }
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a booking by ID for cancellation
router.put("/:bookingId/cancel", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancelRequest } = req.body;

    const booking = await Booking.findOneAndUpdate(
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

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking canceled", booking });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Endpoint to delete a booking by ID
router.delete("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Specified ID is not valid" });
    }

    const booking = await Booking.findOneAndDelete({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: `Booking with ID ${bookingId} was removed successfully.`,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
