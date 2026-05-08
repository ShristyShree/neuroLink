const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  expertiseTags: {
    type: [String],
    default: [],
  },
  availableSlots: [
    {
      date: {
        type: String, // format YYYY-MM-DD
        required: true,
      },
      slots: {
        type: [String], // format HH:MM AM/PM
        required: true,
      }
    }
  ],
}, {
  timestamps: true,
});

const Expert = mongoose.model('Expert', expertSchema);
module.exports = Expert;
