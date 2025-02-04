const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat", // Reference to the Seats collection
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    dayIndex: {
      type: Number,
      required: true,
    },
    slotIndex: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    isWaitingUser: {
      type: Boolean,
      default: false,
    },
    cancelRequests: [
      {
        cancelId: {
          type: String,
          ref: "CancelRequest",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isCanceled: {
          type: Boolean,
          default: false,
        },
      },
    ],
    replacedBookingDate: {
      type: Date,
      default: null,
    },

    // field to automatically expire records
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
