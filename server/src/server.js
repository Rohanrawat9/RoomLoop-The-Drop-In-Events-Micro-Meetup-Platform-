require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const { initializeSocket } = require('./socket/socketHandler');
const { startStatusUpdater } = require('./utils/roomStatusUpdater');

// Validate essential configs
if (!config.mongoUri || !config.jwtSecret) {
  logger.error('Missing required environment variables (MONGO_URI or JWT_SECRET). Check your .env file.');
  process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.set('io', io);
initializeSocket(io);

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB connected!');
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

// Start scheduled room status updater
try {
  startStatusUpdater(io);
} catch (err) {
  logger.error(`Room status updater failed: ${err.message}`);
  process.exit(1);
}

// Start server
const PORT = config.port || 8000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
