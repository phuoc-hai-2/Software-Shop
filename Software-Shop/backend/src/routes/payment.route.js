const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/create', auth, paymentCtrl.createPayment);
router.get('/vnpay-ipn', paymentCtrl.vnpayIpn);

module.exports = router;
