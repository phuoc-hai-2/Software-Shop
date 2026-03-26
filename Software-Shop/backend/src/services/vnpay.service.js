const crypto = require('crypto');
const querystring = require('qs');

exports.createPaymentUrl = (order, userIp) => {
  const tmnCode = process.env.VNPay_TMN_CODE;
  const secretKey = process.env.VNPay_HASH_SECRET;
  const vnpUrl = process.env.VNPay_URL;
  const returnUrl = `${process.env.CLIENT_URL}/vnpay-return`;

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const orderId = order._id.toString();
  const amount = order.total * 100;

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: userIp,
    vnp_CreateDate: createDate
  };
  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: true });
  return paymentUrl;
};

exports.verifyIPN = (params) => {
  const secretKey = process.env.VNPay_HASH_SECRET;
  const vnp_SecureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;
  params = sortObject(params);
  const signData = querystring.stringify(params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  return vnp_SecureHash === signed;
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) sorted[key] = obj[key];
  return sorted;
}
