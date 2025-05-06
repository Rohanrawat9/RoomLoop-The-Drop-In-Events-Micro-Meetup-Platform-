const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');
const { validateGetNotifications, validateMarkNotificationAsRead, validateGetAllNotifications } = require('../validators/notification.validator');
const { validate } = require('../middlewares/validate.middleware');

// Get user's notifications (Protected)
router.get('/', authMiddleware, validateGetNotifications, validate, notificationController.getNotifications);

// Mark a notification as read (Protected)
router.put('/:id/read', authMiddleware, validateMarkNotificationAsRead, validate, notificationController.markNotificationAsRead);

router.get('/admin', authMiddleware, adminMiddleware, validateGetAllNotifications, validate, notificationController.getAllNotifications);

module.exports = router;