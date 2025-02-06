const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
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
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
