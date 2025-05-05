const cron = require('node-cron');
const RoomService = require('../services/room.service');
const Logger = require('./logger'); // Optional, for logging

// Schedule status updates every 5 minutes
const startStatusUpdater = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const updatedCount = await RoomService.updateRoomStatuses();
      Logger.info(`Room status updater ran successfully. Checked ${updatedCount} rooms.`);
    } catch (error) {
      Logger.error(`Room status updater failed: ${error.message}`);
    }
  });
  Logger.info('Room status updater scheduled to run every 5 minutes.');
};

module.exports = { startStatusUpdater };