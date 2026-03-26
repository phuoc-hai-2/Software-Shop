const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Auth routes
app.use('/api/auth', require('./routes/auth.route'));

// Product & Category routes
app.use('/api/products', require('./routes/product.route'));
app.use('/api/categories', require('./routes/category.route'));

// Cart & Order routes
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/orders', require('./routes/order.route'));

// Payment route
app.use('/api/payment', require('./routes/payment.route'));

// Review route
app.use('/api/reviews', require('./routes/review.route'));

// Fulfillment (upload/download file đơn hàng)
app.use('/api/fulfillment', require('./routes/fulfillment.route'));

// Admin dashboard
app.use('/api/admin', require('./routes/admin.route'));

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
