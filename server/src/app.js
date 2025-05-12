const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

// Basic middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Inject io into requests
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api', require('./routes/chat.routes'));

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});


// Test route
app.get('/api/test', (_, res) => {
  res.json({ message: 'API working fine' });
});


// Error handler (last)
app.use(errorMiddleware);

module.exports = app;
