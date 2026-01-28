import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.name || !payload.date || !payload.time) {
      return res.status(400).json({ error: 'Missing required fields: name, date, time' });
    }

    const doc = await Booking.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      service: payload.service,
      date: payload.date,
      time: payload.time,
      // Map front-end "notes" to database "comment"
      comment: payload.notes || payload.comment || '',
    });

    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Error saving booking:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// List recent bookings (optional)
router.get('/', async (_req, res) => {
  try {
    const items = await Booking.find().sort({ createdAt: -1 }).limit(100);
    return res.json(items);
  } catch (err) {
    console.error('Error reading bookings:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
