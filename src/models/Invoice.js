import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema); 