import { Schema, model } from 'mongoose';

const BookingSchema = new Schema({
  name: { type: String, trim: true, required: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  service: { type: String, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  // New field to store staff notes about the customer
  comment: { type: String, trim: true },
}, { timestamps: true });

export default model('Booking', BookingSchema);
