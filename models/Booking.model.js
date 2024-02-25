const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        bookingId: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            unique: true
        },
        userId: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            ref: 'User' // Reference to the Users collection
        },
        seatId: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            ref: 'Seat' // Reference to the Seats collection
        },
        bookingDate: {
            type: Date,
            required: true
        }
    }
)

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
