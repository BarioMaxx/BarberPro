import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bookingsRouter from './routes/bookings.js';
import customersRouter from './routes/customers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/barberpro';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// API routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/customers', customersRouter);

// Serve static files from project root so front-end works
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready on port ${PORT}. Visit https://heritageblade.bario.me/`);
});
