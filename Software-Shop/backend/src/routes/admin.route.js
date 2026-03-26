const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');


// Dashboard
router.get('/dashboard', auth, adminCtrl.dashboardStats);
router.get('/revenue-by-month', auth, adminCtrl.revenueByMonth);
router.get('/user-growth', auth, adminCtrl.userGrowth);
router.get('/order-by-month', auth, adminCtrl.orderByMonth);
router.get('/top-products', auth, adminCtrl.topProducts);

// User management
router.get('/users', auth, adminCtrl.userList);
router.get('/users/:id', auth, adminCtrl.userDetail);
router.put('/users/:id/status', auth, adminCtrl.setUserStatus);
router.get('/users/:id/orders', auth, adminCtrl.userOrderHistory);

// Payment management
router.get('/payments', auth, adminCtrl.paymentList);
router.get('/payments/:id', auth, adminCtrl.paymentDetail);

module.exports = router;
