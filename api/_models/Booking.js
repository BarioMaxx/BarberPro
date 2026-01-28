const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    service: { type: String, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    // Per-booking notes
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
