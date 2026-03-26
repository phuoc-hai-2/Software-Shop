const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// TODO: Import and use routes
// Example: app.use('/api/auth', require('./routes/auth.route'));

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
