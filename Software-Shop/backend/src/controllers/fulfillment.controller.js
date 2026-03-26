const Order = require('../models/order.model');
const nodemailer = require('nodemailer');

// Admin upload file và chuyển trạng thái Completed
exports.uploadFile = async (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ message: 'Chưa có file' });
  const order = await Order.findByIdAndUpdate(id, { fileUrl: req.file.path, status: 'Completed' }, { new: true });
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  // Gửi email cho user
  sendEmail(order.user, order.fileUrl);
  res.json(order);
};

// User tải file
exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order || order.status !== 'Completed' || !order.fileUrl) return res.status(404).json({ message: 'Không có file' });
  res.download(order.fileUrl);
};

async function sendEmail(userId, fileUrl) {
  // TODO: Lấy email user từ userId, gửi email có link fileUrl
  // Placeholder: chỉ gửi log
  console.log(`Gửi email cho user ${userId} với file: ${fileUrl}`);
}
