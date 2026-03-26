const express = require('express');
const router = express.Router();
const fulfillmentCtrl = require('../controllers/fulfillment.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Admin upload file cho đơn hàng
router.post('/upload/:id', auth, upload.single('file'), fulfillmentCtrl.uploadFile);
// User tải file
router.get('/download/:id', auth, fulfillmentCtrl.downloadFile);

module.exports = router;
