const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { getIo } = require('../sockets');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, slot, notes } = req.body;

    // Check if expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    // Check if the slot is still in the expert's availableSlots array.
    // This is optional since our compound index already protects the DB,
    // but it's good practice to verify the slot is technically "bookable".
    // For this basic setup, we'll rely heavily on the DB index.

    const booking = await Booking.create({
      expertId,
      name,
      email,
      phone,
      date,
      slot,
      notes
    });

    // Remove the booked slot from the expert's availableSlots (Optional but good for data consistency)
    // Here we can either remove it from availableSlots or let the frontend calculate availability 
    // by comparing availableSlots with existing bookings. For simplicity, we just rely on DB unique constraint 
    // and let frontend handle it or we can clean up availableSlots here. Let's just create the booking for now.

    // Emit socket event to notify all connected clients
    try {
      const io = getIo();
      io.emit('slot_booked', { expertId, date, slot, bookingId: booking._id });
    } catch (socketError) {
      console.error('Socket error:', socketError.message);
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    // Check for Mongoose duplicate key error for our compound index
    if (error.code === 11000) {
      res.status(400);
      error.message = 'Slot already booked';
    }
    next(error);
  }
};

// @desc    Get bookings by email
// @route   GET /api/bookings?email=...
// @access  Public
const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email to search for bookings');
    }

    const bookings = await Booking.find({ email })
      .populate('expertId', 'name category image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Public
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booked slots for a specific expert
// @route   GET /api/bookings/expert/:expertId
// @access  Public
const getBookedSlotsForExpert = async (req, res, next) => {
  try {
    const { expertId } = req.params;
    const bookings = await Booking.find({ expertId, status: { $ne: 'Cancelled' } }).select('date slot -_id');
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
  getBookedSlotsForExpert
};
