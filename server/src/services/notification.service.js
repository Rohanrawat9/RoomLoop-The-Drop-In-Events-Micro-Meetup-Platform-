const Notification = require("../models/notification.model");
const Logger = require("../utils/logger");

class NotificationService {
  // Create a notification
  async createNotification({ userId, message, type, roomId }, io) {
    try {
      const notification = new Notification({
        user: userId,
        message,
        type,
        room: roomId || null,
      });
      await notification.save();

      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate("user", "username email")
        .populate("room", "title");

      // Broadcast notification via Socket.IO
      if (io) {
        io.to(`user-${userId}`).emit("newNotification", populatedNotification);
      }

      Logger.info(`Notification created for user ${userId}: ${message}`);
      return populatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to create notification for user ${userId}: ${error.message}`
      );
      throw error;
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId) {
    try {
      const notifications = await Notification.find({ user: userId })
        .populate("user", "username email")
        .populate("room", "title")
        .sort({ createdAt: -1 }); // Newest first
      return notifications;
    } catch (error) {
      Logger.error(
        `Failed to fetch notifications for user ${userId}: ${error.message}`
      );
      throw error;
    }
  }

  // Mark a notification as read
  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        user: userId,
      });
      if (!notification) {
        throw new Error("Notification not found or not authorized");
      }
      notification.read = true;
      await notification.save();
      Logger.info(
        `Notification ${notificationId} marked as read for user ${userId}`
      );
      return notification;
    } catch (error) {
      Logger.error(
        `Failed to mark notification ${notificationId} as read: ${error.message}`
      );
      throw error;
    }
  }

  // Admin: Get all notifications
  async getAllNotifications() {
    try {
      const notifications = await Notification.find()
        .populate("user", "username email")
        .populate("room", "title")
        .sort({ createdAt: -1 });
      return notifications;
    } catch (error) {
      Logger.error(`Failed to fetch all notifications: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new NotificationService();
