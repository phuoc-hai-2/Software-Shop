const Order = require('../models/order.model');
const User = require('../models/user.model');
const vnpayService = require('../services/vnpay.service');
const nodemailer = require('nodemailer');

// Tạo link thanh toán VNPay
exports.createPayment = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.status !== 'Pending') return res.status(400).json({ message: 'Đơn hàng không hợp lệ' });
  const paymentUrl = vnpayService.createPaymentUrl(order, req.ip);
  res.json({ paymentUrl });
};

// Xử lý IPN callback từ VNPay
exports.vnpayIpn = async (req, res) => {
  const params = req.query;
  if (!vnpayService.verifyIPN({ ...params })) return res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
  const orderId = params.vnp_TxnRef;
  const rspCode = params.vnp_ResponseCode;
  const amount = Number(params.vnp_Amount) / 100;
  const order = await Order.findById(orderId);
  if (!order) return res.status(400).json({ RspCode: '01', Message: 'Order not found' });
  if (order.total !== amount) return res.status(400).json({ RspCode: '04', Message: 'Invalid amount' });
  if (order.status === 'Paid') return res.json({ RspCode: '00', Message: 'Order already paid' });
  if (rspCode === '00') {
    order.status = 'Paid';
    order.paymentInfo = params;
    await order.save();
    // Gửi email xác nhận thanh toán thành công
    try {
      const user = await User.findById(order.user);
      if (user && user.email) {
        await sendOrderEmail(user.email, order, 'paid');
      }
    } catch (e) { console.log('Send email error:', e.message); }
    return res.json({ RspCode: '00', Message: 'Success' });
  } else {
    order.status = 'Failed';
    order.paymentInfo = params;
    await order.save();
    return res.json({ RspCode: '00', Message: 'Payment failed' });
  }

// Gửi email đơn hàng
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
};
