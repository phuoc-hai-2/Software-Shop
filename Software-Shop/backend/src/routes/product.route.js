const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', productCtrl.list);
router.get('/:id', productCtrl.detail);
router.post('/', auth, productCtrl.create);
router.put('/:id', auth, productCtrl.update);
router.delete('/:id', auth, productCtrl.remove);

module.exports = router;
