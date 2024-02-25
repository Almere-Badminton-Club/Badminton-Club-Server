const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Booking = require("../models/Booking.model"); // Import Booking model
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isValidObjectId } = require("mongoose");

const saltRounds = 10;

// User registration endpoint
router.post("/signup", (req, res, next) => {
  const {name, email, password  } = req.body;

  // Check if email, password, and name are provided
  if (email === '' || password === '' || name === '' ) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }
  
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  // Check if user with the same email already exists
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // Hash the password
      return bcrypt.hash(password, saltRounds);
    })
    .then(hashedPassword => {
      // Create a new user
      return User.create({ email, password: hashedPassword, name });
    })
    .then(newUser => {
      // Return success response
      res.status(201).json({ message: "User registered successfully.", user: newUser });
    })
    .catch(error => {
      next(error);
    });
});


// User login endpoint
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // Find user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Compare password hashes
      return bcrypt.compare(password, user.password);
    })
    .then(passwordMatch => {
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return token in response
      res.status(200).json({ token });
    })
    .catch(error => {
      next(error);
    });
});


// JWT verification endpoint
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid, isAuthenticated middleware sets req.payload
  res.status(200).json({ user: req.payload });
});

// Other endpoints for seat availability, booking, cancellation, and retrieving user bookings remain unchanged

module.exports = router;
