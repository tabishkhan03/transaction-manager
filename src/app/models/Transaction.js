import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['expense', 'income'], required: true },
  category: { type: String, required: true },
  mode: { type: String, enum: ['cash', 'online'], required: true },  
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
