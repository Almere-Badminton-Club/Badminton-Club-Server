// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// Mount bookings routes
const bookingsRouter = require('./routes/bookings.router');
app.use('/bookings', bookingsRouter);

// Mount seats routes
const seatsRouter = require('./routes/seats.routes');
app.use('/seats', seatsRouter);

// Mount cancelRequest routes
const cancelRequestRouter = require('./routes/cancelRequest.routes');
app.use('/cancel', cancelRequestRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
