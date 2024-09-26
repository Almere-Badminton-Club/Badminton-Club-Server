const express = require('express');
const router = express.Router();
const CancelRequest = require('../models/CancelRequest.model'); 
const Booking = require('../models/Booking.model');

router.post('/', (req, res, next) => {
  const { cancelId, createdAt, bookingId } = req.body;

  CancelRequest.create({ cancelId, createdAt, bookingId })
  .then(newCancelRequest => {
    return Booking.findByIdAndUpdate(bookingId, {$push: {cancelRequest: newCancelRequest._id}});
  })
  .then(response => res.json(response))
  .catch(err => res.json(err));
});


module.exports = router;
