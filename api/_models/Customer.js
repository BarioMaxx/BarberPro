const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, index: true },
    email: { type: String, trim: true, index: true },
    // Persistent staff notes (distinct from bookings)
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
