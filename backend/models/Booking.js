const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
  },
  slot: {
    type: String, // format HH:MM AM/PM
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  }
}, {
  timestamps: true,
});

// Compound unique index to prevent double booking for the same expert at the same date and time
bookingSchema.index({ expertId: 1, date: 1, slot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
