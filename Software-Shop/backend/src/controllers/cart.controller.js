const Cart = require('../models/cart.model');

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.json(cart);
};

// Thêm/sửa sản phẩm trong giỏ
exports.updateCart = async (req, res) => {
  const { items } = req.body; // [{product, variant, quantity}]
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items });
  else {
    cart.items = items;
    cart.updatedAt = Date.now();
    await cart.save();
  }
  res.json(cart);
};

// Xóa giỏ hàng
exports.clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ message: 'Đã xóa giỏ hàng' });
};
