const express = require('express');
const { 
  createBooking, 
  getBookingsByEmail, 
  updateBookingStatus,
  getBookedSlotsForExpert 
} = require('../controllers/bookingController');

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(getBookingsByEmail);

router.route('/:id/status')
  .patch(updateBookingStatus);

router.route('/expert/:expertId')
  .get(getBookedSlotsForExpert);

module.exports = router;
