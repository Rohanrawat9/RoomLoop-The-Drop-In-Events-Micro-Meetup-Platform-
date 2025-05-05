const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/notifications', require('./routes/notification.routes')); // New

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working fine' });
});

module.exports = app;