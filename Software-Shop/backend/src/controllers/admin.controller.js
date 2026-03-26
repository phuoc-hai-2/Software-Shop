const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

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
