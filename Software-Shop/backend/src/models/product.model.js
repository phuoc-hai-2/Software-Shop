const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  price: { type: Number, required: true },
  variants: [{
    name: String, // Ví dụ: 1 tháng, 6 tháng, vĩnh viễn
    price: Number
  }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  views: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
