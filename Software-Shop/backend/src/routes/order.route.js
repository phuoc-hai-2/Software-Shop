const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, orderCtrl.create);
router.get('/', auth, orderCtrl.list);
router.get('/:id', auth, orderCtrl.detail);

module.exports = router;
