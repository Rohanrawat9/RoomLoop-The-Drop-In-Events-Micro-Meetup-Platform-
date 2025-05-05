const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startStatusUpdater } = require('./utils/roomStatusUpdater');

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
      startStatusUpdater(); // Start cron job for room status updates
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });