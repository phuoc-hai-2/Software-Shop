const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Thêm sản phẩm
exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Tạo sản phẩm thất bại', error: err.message });
  }
};

// Danh sách sản phẩm + tìm kiếm + lọc
exports.list = async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  let filter = {};
  if (keyword) filter.name = { $regex: keyword, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  const products = await Product.find(filter)
    .populate('category')
    .sort(sort ? { [sort]: -1 } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(products);
};

// Chi tiết sản phẩm
exports.detail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('category');
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  // Tăng lượt xem
  product.views++;
  await product.save();
  res.json(product);
};

// Sửa sản phẩm
exports.update = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(product);
};

// Xóa sản phẩm
exports.remove = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Đã xóa sản phẩm' });
};
