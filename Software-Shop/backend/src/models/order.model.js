const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Completed', 'Failed', 'Cancelled', 'Refunded'], default: 'Pending' },
  paymentMethod: { type: String, default: 'vnpay' },
  paymentInfo: { type: Object },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
