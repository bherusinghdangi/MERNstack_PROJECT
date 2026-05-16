const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['DEPOSIT', 'WITHDRAWAL'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['COMPLETED', 'FAILED', 'PENDING'], default: 'COMPLETED' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
