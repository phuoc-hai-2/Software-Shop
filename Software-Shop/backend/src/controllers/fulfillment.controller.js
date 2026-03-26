const Order = require('../models/order.model');
const User = require('../models/user.model');
const nodemailer = require('nodemailer');

// Admin upload file và chuyển trạng thái Completed
exports.uploadFile = async (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ message: 'Chưa có file' });
  const order = await Order.findByIdAndUpdate(id, { fileUrl: req.file.path, status: 'Completed' }, { new: true });
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  // Gửi email cho user
  try {
    const user = await User.findById(order.user);
    if (user && user.email) {
      await sendOrderEmail(user.email, order, 'completed');
    }
  } catch (e) { console.log('Send email error:', e.message); }
  res.json(order);
};

// User tải file
exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order || order.status !== 'Completed' || !order.fileUrl) return res.status(404).json({ message: 'Không có file' });
  res.download(order.fileUrl);
};

// Gửi email đơn hàng (dùng chung với payment.controller)
async function sendOrderEmail(email, order, type) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  let subject = '', html = '';
  if (type === 'paid') {
    subject = 'Xác nhận thanh toán đơn hàng';
    html = `<p>Đơn hàng #${order._id} đã được thanh toán thành công.</p><p>Chúng tôi sẽ xử lý và gửi file nhận hàng sớm nhất.</p>`;
  } else if (type === 'completed') {
    subject = 'Đơn hàng đã hoàn thành';
    html = `<p>Đơn hàng #${order._id} đã hoàn thành.</p><p>Bạn có thể tải file nhận hàng tại trang chi tiết đơn hàng.</p>`;
  }
  await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject, html });
}
