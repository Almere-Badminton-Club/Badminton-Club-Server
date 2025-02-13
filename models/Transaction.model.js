const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const transactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amountCredited: {
    type: Number,
    required: true,
  },
  amountDeducted: {
    type: Number,
    default: 0,
  },
  transactionType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amountCreditDate: {
    type: Date,
    default: Date.now,
  },
  isManualCredit: {
    type: Boolean,
    default: false,
  },
  replacedBookingDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    dafault: Date.now,
  },
});

transactionSchema.index({ createdAt: 1}, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
