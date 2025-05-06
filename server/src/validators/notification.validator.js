const { param } = require('express-validator');

const validateGetNotifications = [];
const validateMarkNotificationAsRead = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];
const validateGetAllNotifications = [];

module.exports = {
  validateGetNotifications,
  validateMarkNotificationAsRead,
  validateGetAllNotifications,
};