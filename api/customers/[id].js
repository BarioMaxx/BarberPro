const dbConnect = require('../_db');
const Customer = require('../_models/Customer');
const readJson = require('../_util/readJson');

module.exports = async function handler(req, res) {
  try {
    await dbConnect();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    if (req.method === 'GET') {
      const doc = await Customer.findById(id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(doc);
    }

    if (req.method === 'PUT') {
      const payload = await readJson(req);
      const doc = await Customer.findByIdAndUpdate(
        id,
        {
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          comment: payload.comment,
        },
        { new: true }
      );
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error('API /customers/[id] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
