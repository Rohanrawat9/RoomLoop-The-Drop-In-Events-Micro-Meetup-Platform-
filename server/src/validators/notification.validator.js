const { param } = require('express-validator');

const validateGetNotifications = []; // No validation needed for GET (user ID from auth)

const validateMarkNotificationAsRead = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];

module.exports = {
  validateGetNotifications,
  validateMarkNotificationAsRead,
};