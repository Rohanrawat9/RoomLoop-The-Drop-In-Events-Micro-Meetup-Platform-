// chat.routes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateSendMessage, validateGetMessages } = require('../validators/chat.validator');
const { validate } = require('../middlewares/validate.middleware');

// Add `/rooms` prefix here
router.post(
  '/rooms/:id/messages',
  authMiddleware,
  validateSendMessage,
  validate,
  chatController.sendMessage
);

router.get(
  '/rooms/:id/messages',
  authMiddleware,
  validateGetMessages,
  validate,
  chatController.getMessages
);

module.exports = router;
