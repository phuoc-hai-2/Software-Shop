const Review = require('../models/review.model');
const Product = require('../models/product.model');

// Viết review
exports.create = async (req, res) => {
  const { product, rating, content, images } = req.body;
  const review = await Review.create({ user: req.user.id, product, rating, content, images });
  // Cập nhật rating trung bình cho sản phẩm
  const reviews = await Review.find({ product, status: 'approved' });
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : rating;
  await Product.findByIdAndUpdate(product, { rating: avg, numReviews: reviews.length });
  res.status(201).json(review);
};

// Sửa review
exports.update = async (req, res) => {
  const { id } = req.params;
  const { rating, content, images } = req.body;
  const review = await Review.findOneAndUpdate({ _id: id, user: req.user.id }, { rating, content, images }, { new: true });
  res.json(review);
};

// Xóa review
exports.remove = async (req, res) => {
  const { id } = req.params;
  await Review.findOneAndDelete({ _id: id, user: req.user.id });
  res.json({ message: 'Đã xóa review' });
};

// Danh sách review theo sản phẩm
exports.listByProduct = async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId, status: 'approved' }).populate('user', 'name avatar');
  res.json(reviews);
};

// Danh sách review cho admin
exports.listAll = async (req, res) => {
  const reviews = await Review.find().populate('user', 'name').populate('product', 'name');
  res.json(reviews);
};

// Duyệt/ẩn review (admin)
exports.setStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  res.json(review);
};

// Admin reply
exports.reply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  const review = await Review.findByIdAndUpdate(id, { adminReply: reply }, { new: true });
  res.json(review);
};
