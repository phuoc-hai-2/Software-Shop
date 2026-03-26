const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, cartCtrl.getCart);
router.put('/', auth, cartCtrl.updateCart);
router.delete('/', auth, cartCtrl.clearCart);

module.exports = router;
