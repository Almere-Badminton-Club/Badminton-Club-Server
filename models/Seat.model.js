const { Schema, model } = require("mongoose");

const seatSchema = new Schema(
    {
        ObjectId: {
            type: String, 
            required: true,
            unique: true
        },
        seat_number: {
            type: String,
            required: true
        },
        is_booked: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: [true]
        }
    }
)

const Seat = model("Seat", seatSchema);

module.exports = Seat;
