const Category = require('../models/category.model');

exports.create = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Tạo danh mục thất bại', error: err.message });
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  const category = await Category.findByIdAndUpdate(id, { name, slug }, { new: true });
  res.json(category);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.json({ message: 'Đã xóa danh mục' });
};
