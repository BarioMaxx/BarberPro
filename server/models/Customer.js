import { Schema, model } from 'mongoose';

const CustomerSchema = new Schema({
  name: { type: String, trim: true, required: true },
  phone: { type: String, trim: true, index: true },
  email: { type: String, trim: true, index: true },
  comment: { type: String, trim: true },
}, { timestamps: true });

export default model('Customer', CustomerSchema);
