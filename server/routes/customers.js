import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// List customers
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? {
      $or: [
        { name: new RegExp(q, 'i') },
        { phone: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
      ]
    } : {};
    const items = await Customer.find(filter).sort({ updatedAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    console.error('Error listing customers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, comment } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });
    const doc = await Customer.create({ name, phone, email, comment });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, comment } = req.body || {};
    const doc = await Customer.findByIdAndUpdate(id, { name, phone, email, comment }, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read single customer
router.get('/:id', async (req, res) => {
  try {
    const doc = await Customer.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('Error reading customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
