const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
// --- USER MANAGEMENT ---
// Danh sách user
exports.userList = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Chi tiết user
exports.userDetail = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
  res.json(user);
};

// Ban/mở khóa user
exports.setUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' | 'banned'
  if (!['active', 'banned'].includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
  res.json(user);
};

// Lịch sử mua hàng của user
exports.userOrderHistory = async (req, res) => {
  const { id } = req.params;
  const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
  res.json(orders);
};

// --- PAYMENT MANAGEMENT ---
// Lịch sử giao dịch toàn hệ thống
exports.paymentList = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// Chi tiết giao dịch
exports.paymentDetail = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
  res.json(order);
};

exports.dashboardStats = async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $in: ['Paid', 'Completed'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const totalUser = await User.countDocuments();
  const totalOrder = await Order.countDocuments();
  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    totalUser,
    totalOrder
  });
};

exports.revenueByMonth = async (req, res) => {
  const data = await Order.aggregate([
    { $match: { status: { $in: ['Paid', 'Completed'] } } },
    { $group: {
      _id: { $substr: ['$createdAt', 0, 7] },
      total: { $sum: '$total' },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
};

exports.userGrowth = async (req, res) => {
  const data = await User.aggregate([
    { $group: {
      _id: { $substr: ['$createdAt', 0, 7] },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
};

exports.orderByMonth = async (req, res) => {
  const data = await Order.aggregate([
    { $group: {
      _id: { $substr: ['$createdAt', 0, 7] },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
};

exports.topProducts = async (req, res) => {
  const topSold = await Product.find().sort({ sold: -1 }).limit(5);
  const topViewed = await Product.find().sort({ views: -1 }).limit(5);
  res.json({ topSold, topViewed });
};
