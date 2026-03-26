const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/review.controller');
const auth = require('../middlewares/auth.middleware');

// User
router.post('/', auth, reviewCtrl.create);
router.put('/:id', auth, reviewCtrl.update);
router.delete('/:id', auth, reviewCtrl.remove);
router.get('/product/:productId', reviewCtrl.listByProduct);

// Admin
router.get('/admin/all', auth, reviewCtrl.listAll);
router.put('/admin/status/:id', auth, reviewCtrl.setStatus);
router.put('/admin/reply/:id', auth, reviewCtrl.reply);

module.exports = router;
