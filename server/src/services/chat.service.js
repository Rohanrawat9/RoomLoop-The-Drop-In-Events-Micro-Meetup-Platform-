const Message = require('../models/message.model');
const Room = require('../models/room.model');
const NotificationService = require('./notification.service');
const Logger = require('../utils/logger');

class ChatService {
  async sendMessage(roomId, userId, content, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.participants.includes(userId) && room.host.toString() !== userId) {
        throw new Error('User is not a participant or host of this room');
      }

      const message = new Message({
        room: roomId,
        sender: userId,
        content,
      });
      await message.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username email')
        .populate('room', 'title');

      // Broadcast message to room participants via Socket.IO
      io.to(`room-${roomId}`).emit('new-message', populatedMessage); // Changed to new-message

      // Notify participants (except sender) of new message
      const userIds = [...room.participants, room.host].filter(
        (id) => id.toString() !== userId
      );
      for (const recipientId of userIds) {
        await NotificationService.createNotification(
          {
            userId: recipientId,
            message: `New message in room "${room.title}"`,
            type: 'NewMessage',
            roomId,
          },
          io
        );
      }

      Logger.info(`Message sent in room ${roomId} by user ${userId}`);
      return populatedMessage;
    } catch (error) {
      Logger.error(`Failed to send message in room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async getMessages(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.participants.includes(userId) && room.host.toString() !== userId) {
        throw new Error('User is not a participant or host of this room');
      }

      const messages = await Message.find({ room: roomId })
        .populate('sender', 'username email')
        .populate('room', 'title')
        .sort({ timestamp: 1 }); // Oldest first
      Logger.info(`Fetched messages for room ${roomId}`);
      return messages;
    } catch (error) {
      Logger.error(`Failed to fetch messages for room ${roomId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ChatService();