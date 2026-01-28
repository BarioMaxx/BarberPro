const dbConnect = require('./_db');
const Booking = require('./_models/Booking');
const readJson = require('./_util/readJson');

module.exports = async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'POST') {
      const payload = await readJson(req);
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
        // Map front-end "notes" to DB "comment"
        comment: payload.notes || payload.comment || '',
      });

      return res.status(201).json({ ok: true, id: doc._id });
    }

    if (req.method === 'GET') {
      const items = await Booking.find().sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(items);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error('API /bookings error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
