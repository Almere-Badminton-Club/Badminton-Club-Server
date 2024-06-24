const express = require('express');
const router = express.Router();
const Seat = require("../models/Seat.model");
const User = require("../models/User.model")

// Endpoint to fetch all seats
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);

  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch a single seat by ID

router.get("/:seatId", async (req, res) => {
  const { seatId } = req.params;
  try {
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found." });
    }
    res.json(seat);
  } catch (error) {
    console.error("Error fetching seat:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Endpoint to create a new seat

router.post("/", async (req, res) => {
  try {
  const { ObjectId, seat_number, name } = req.body;
  console.log(" nisha patil",req.body);

  // Validate required data
  if (!ObjectId || !seat_number || !name ) {
    return res.status(400).json({ message: 'Missing required data in request body.'});
  }

  // Check if user exists
  const user = await User.findOne({name});
  if(!user) {
    return res.status(404).json({ message: "User not found"});
  }

  // Create new Seat
    const newSeat = new Seat({
      ObjectId,
      seat_number,
      name
    });

    // Save seat to database
    const savedSeat = await newSeat.save();
    res.status(201).json({ message: "Seat created successfully.", seat: savedSeat });
  } catch (error) {
    console.error("Error creating Seat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a seat by id

router.put("/:seatId", async (req, res) => {
  const { seatId } = req.params;
  const { seat_number, name } = req.body;
  try {
    const updatedSeat = await Seat.findByIdAndUpdate(seatId, { seat_number, name }, { new: true });
    if (!updatedSeat) {
      return res.status(404).json({ message: "Seat not found." });
    }
    res.json({ message: "Seat updated successfully.", seat: updatedSeat });
  } catch (error) {
    console.error("Error updating seat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Endpoint to delete a seat by Id

router.delete("/:seatId", async (req, res) => {
  const { seatId } = req.params;
  try {
    const deletedSeat = await Seat.findByIdAndDelete(seatId);
    if(!deletedSeat) {
      return res.status(404).json({ message: "Seat not found." });
    }
    res.json({ message: " Seat deleted successfully." });
  } catch (error){
    console.error("Error deleting seat:", error);
    res.status(500).json({ error: "Internal Server Error"});
  }
});

module.exports = router;