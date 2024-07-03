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
  const { name, email, password } = req.body;

  // Check if email, password, and name are provided
  if (email === '' || password === '' || name === '') {
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
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      
      // Create a new user
      return User.create({ email, password: hashedPassword, name });
    })
    .then(newUser => {
      if (!newUser){
        //Handle the caes where user creation failed
        res.status(500).json({ message: "Failed to create user." });
        return;
      }
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = newUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Return success response
      res.status(201).json({ message: "User registered successfully.", user: user });
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
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken, userId: _id });
      } else {
        // If the password is incorrect, send an error response
        res.status(401).json({ message: "Incorrect password." });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});



// JWT verification endpoint
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid, isAuthenticated middleware sets req.payload
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json({ user: req.payload });
});

// Other endpoints for seat availability, booking, cancellation, and retrieving user bookings remain unchanged

module.exports = router;
