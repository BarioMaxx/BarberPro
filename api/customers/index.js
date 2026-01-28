const dbConnect = require('../_db');
const Customer = require('../_models/Customer');
const readJson = require('../_util/readJson');

module.exports = async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const q = (req.query?.q || '').trim();
      const filter = q
        ? {
            $or: [
              { name: new RegExp(q, 'i') },
              { phone: new RegExp(q, 'i') },
              { email: new RegExp(q, 'i') },
            ],
          }
        : {};

      const items = await Customer.find(filter).sort({ updatedAt: -1 }).limit(200);
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const payload = await readJson(req);
      if (!payload.name) return res.status(400).json({ error: 'Missing required field: name' });

      const doc = await Customer.create({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        comment: payload.comment,
      });

      return res.status(201).json({ ok: true, id: doc._id });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error('API /customers error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
