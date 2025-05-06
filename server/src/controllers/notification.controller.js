const NotificationService = require('../services/notification.service');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    res.json({ message: 'Notifications fetched successfully', notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await NotificationService.markNotificationAsRead(req.params.id, req.user.id);
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.json({ message: 'All notifications fetched successfully', notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};