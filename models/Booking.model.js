const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        bookingId: {
            type: String, // or ObjectId if using MongoDB
            required: true,
            unique: true
        },
        userId: {
            type: Schema.Types.ObjectId, // or ObjectId if using MongoDB
            ref: 'User', // Reference to the Users collection
            required: true
        },
        seatId: {
            type: Schema.Types.ObjectId, // or ObjectId if using MongoDB
            ref: 'Seat', // Reference to the Seats collection
            required: true,
        },
        bookingDate: {
            type: Date,
            required: true
        },
        dayIndex: {
            type: Number,
            required: true,
        },
        slotIndex: {
            type: Number,
            required: true,
        },
    });

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
