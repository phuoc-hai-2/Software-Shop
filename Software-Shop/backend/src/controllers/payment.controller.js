const Order = require('../models/order.model');
const vnpayService = require('../services/vnpay.service');

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
    return res.json({ RspCode: '00', Message: 'Success' });
  } else {
    order.status = 'Failed';
    order.paymentInfo = params;
    await order.save();
    return res.json({ RspCode: '00', Message: 'Payment failed' });
  }
};
