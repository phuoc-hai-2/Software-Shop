const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Tạo đơn hàng từ giỏ hàng
exports.create = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Giỏ hàng trống' });
    const items = cart.items.map(i => ({
      product: i.product._id,
      variant: i.variant,
      price: i.product.price,
      quantity: i.quantity
    }));
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ user: req.user.id, items, total });
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Tạo đơn hàng thất bại' });
  }
};

// Lịch sử đơn hàng
exports.list = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

// Chi tiết đơn hàng
exports.detail = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  res.json(order);
};
