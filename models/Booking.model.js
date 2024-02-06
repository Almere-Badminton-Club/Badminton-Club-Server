const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        booking_id: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            unique: true
        },
        user_id: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            ref: 'User' // Reference to the Users collection
        },
        seat_id: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            ref: 'Seat' // Reference to the Seats collection
        },
        booking_date: {
            type: Date,
            required: true
        }
    }
)

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
