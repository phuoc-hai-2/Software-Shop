const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', categoryCtrl.list);
router.post('/', auth, categoryCtrl.create);
router.put('/:id', auth, categoryCtrl.update);
router.delete('/:id', auth, categoryCtrl.remove);

module.exports = router;
