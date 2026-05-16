const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  status: { type: String, enum: ['PENDING', 'EXECUTED', 'CANCELLED'], default: 'EXECUTED' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
