const { body, param } = require('express-validator');

const validateSendMessage = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('content').notEmpty().withMessage('Message content is required'),
];

const validateGetMessages = [
  param('id').isMongoId().withMessage('Invalid room ID'),
];

module.exports = { validateSendMessage, validateGetMessages };