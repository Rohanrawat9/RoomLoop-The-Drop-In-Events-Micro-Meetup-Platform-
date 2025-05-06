const Room = require('../models/room.model');
const NotificationService = require('./notification.service');
const Logger = require('../utils/logger');

class RoomService {
  async createRoom(data, userId, io) {
    try {
      const room = new Room({
        ...data,
        host: userId,
        participants: data.type === 'private' ? [userId] : [],
      });
      await room.save();

      const populatedRoom = await Room.findById(room._id)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      Logger.info(`Room created: ${room._id} by user ${userId}`);
      io.to(`user-${userId}`).emit('roomUpdate', populatedRoom);
      return populatedRoom;
    } catch (error) {
      Logger.error(`Failed to create room: ${error.message}`);
      throw error;
    }
  }

  async getRoomById(roomId, userId) {
    try {
      const room = await Room.findById(roomId)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');
      if (!room) {
        throw new Error('Room not found');
      }

      if (
        room.host.toString() !== userId &&
        !room.participants.some((p) => p._id.toString() === userId) &&
        !room.invitedUsers.some((u) => u._id.toString() === userId)
      ) {
        throw new Error('User is not authorized to view this room');
      }

      Logger.info(`Room fetched: ${roomId} for user ${userId}`);
      return room;
    } catch (error) {
      Logger.error(`Failed to fetch room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async updateRoom(roomId, data, userId, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.host.toString() !== userId) {
        throw new Error('Only the host can update the room');
      }

      if (data.startTime && data.endTime && new Date(data.startTime) >= new Date(data.endTime)) {
        throw new Error('End time must be after start time');
      }

      Object.assign(room, data);
      await room.save();

      const populatedRoom = await Room.findById(room._id)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      Logger.info(`Room updated: ${roomId} by user ${userId}`);
      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomUpdate', populatedRoom);
        io.to(`room-${roomId}`).emit('roomUpdate', populatedRoom);
      }
      return populatedRoom;
    } catch (error) {
      Logger.error(`Failed to update room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async deleteRoom(roomId, userId, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.host.toString() !== userId) {
        throw new Error('Only the host can delete the room');
      }

      await room.remove();
      Logger.info(`Room deleted: ${roomId} by user ${userId}`);

      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomDeleted', { roomId });
        io.to(`room-${roomId}`).emit('roomDeleted', { roomId });
        await NotificationService.createNotification(
          {
            userId: id,
            message: `Room "${room.title}" has been deleted`,
            type: 'RoomDeleted',
            roomId,
          },
          io
        );
      }
      return { message: 'Room deleted successfully' };
    } catch (error) {
      Logger.error(`Failed to delete room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async joinRoom(roomId, userId, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.status === 'Closed') {
        throw new Error('Room is closed');
      }

      if (room.participants.some((p) => p._id.toString() === userId)) {
        throw new Error('User is already a participant');
      }

      if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
        throw new Error('Room has reached maximum participants');
      }

      if (room.type === 'private' && !room.invitedUsers.some((u) => u._id.toString() === userId)) {
        throw new Error('User is not invited to this private room');
      }

      room.participants.push(userId);
      await room.save();

      const populatedRoom = await Room.findById(roomId)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      Logger.info(`User ${userId} joined room ${roomId}`);
      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomUpdate', populatedRoom);
        io.to(`room-${roomId}`).emit('roomUpdate', populatedRoom);
      }

      if (room.host.toString() !== userId) {
        await NotificationService.createNotification(
          {
            userId: room.host.toString(),
            message: `A new user joined your room: ${room.title}`,
            type: 'RoomJoined',
            roomId,
          },
          io
        );
      }

      return populatedRoom;
    } catch (error) {
      Logger.error(`Failed to join room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async leaveRoom(roomId, userId, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (!room.participants.some((p) => p._id.toString() === userId)) {
        throw new Error('User is not a participant in this room');
      }

      if (room.host.toString() === userId) {
        throw new Error('Host cannot leave the room');
      }

      room.participants = room.participants.filter((id) => id.toString() !== userId);
      await room.save();

      const populatedRoom = await Room.findById(roomId)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      Logger.info(`User ${userId} left room ${roomId}`);
      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomUpdate', populatedRoom);
        io.to(`room-${roomId}`).emit('roomUpdate', populatedRoom);
      }

      await NotificationService.createNotification(
        {
          userId: room.host.toString(),
          message: `A user left your room: ${room.title}`,
          type: 'RoomLeft',
          roomId,
        },
        io
      );

      return populatedRoom;
    } catch (error) {
      Logger.error(`Failed to leave room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async inviteToRoom(roomId, userId, invitedUserIds, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.host.toString() !== userId) {
        throw new Error('Only the host can invite users');
      }

      if (room.type !== 'private') {
        throw new Error('Invitations are only for private rooms');
      }

      invitedUserIds.forEach((id) => {
        if (!room.invitedUsers.some((u) => u._id.toString() === id)) {
          room.invitedUsers.push(id);
        }
      });

      await room.save();

      const populatedRoom = await Room.findById(roomId)
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      Logger.info(`Users ${invitedUserIds.join(', ')} invited to room ${roomId} by ${userId}`);
      for (const invitedUserId of invitedUserIds) {
        io.to(`user-${invitedUserId}`).emit('roomUpdate', populatedRoom);
        io.to(`room-${roomId}`).emit('roomUpdate', populatedRoom);
        await NotificationService.createNotification(
          {
            userId: invitedUserId,
            message: `You were invited to join the private room: ${room.title}`,
            type: 'RoomInvitation',
            roomId,
          },
          io
        );
      }

      return populatedRoom;
    } catch (error) {
      Logger.error(`Failed to invite users to room ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async getRoomsByUser(userId) {
    try {
      const rooms = await Room.find({
        $or: [
          { host: userId },
          { participants: userId },
          { invitedUsers: userId },
        ],
      })
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');
      Logger.info(`Fetched rooms for user ${userId}`);
      return rooms;
    } catch (error) {
      Logger.error(`Failed to fetch rooms for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async updateRoomStatuses(io) {
    try {
      const now = new Date();
      const rooms = await Room.find();

      let updatedCount = 0;
      let deletedCount = 0;

      for (const room of rooms) {
        if (!room.host || !room.startTime || !room.endTime) {
          Logger.warn(`Deleting invalid room ${room._id} due to missing required fields.`);
          try {
            await Room.findByIdAndDelete(room._id);
            deletedCount++;
          } catch (err) {
            Logger.error(`Failed to delete invalid room ${room._id}: ${err.message}`);
          }
          continue;
        }

        let newStatus = room.status;
        if (now < room.startTime) {
          newStatus = 'Scheduled';
        } else if (now >= room.startTime && now <= room.endTime) {
          newStatus = 'Active';
        } else if (now > room.endTime) {
          newStatus = 'Completed';
        }

        if (newStatus !== room.status) {
          room.status = newStatus;
          try {
            await room.save();
            updatedCount++;

            const populatedRoom = await Room.findById(room._id)
              .populate('host', 'username email')
              .populate('participants', 'username email')
              .populate('invitedUsers', 'username email');

            const userIds = [
              ...room.participants.map((p) => p._id.toString()),
              room.host.toString(),
            ];
            for (const id of userIds) {
              io.to(`user-${id}`).emit('roomUpdate', populatedRoom);
              io.to(`room-${roomId}`).emit('roomUpdate', populatedRoom);
              await NotificationService.createNotification(
                {
                  userId: id,
                  message: `Room "${room.title}" is now ${newStatus}`,
                  type: 'RoomStatusUpdate',
                  roomId: room._id,
                },
                io
              );
            }
          } catch (error) {
            Logger.error(`Error saving room ${room._id}: ${error.message}`);
          }
        }
      }

      Logger.info(`Room statuses updated: ${updatedCount}, invalid rooms deleted: ${deletedCount}`);
      return { updatedCount, deletedCount };
    } catch (error) {
      Logger.error(`Failed to update room statuses: ${error.message}`);
      throw error;
    }
  }

  async adminDeleteRoom(roomId, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomDeleted', { roomId });
        io.to(`room-${roomId}`).emit('roomDeleted', { roomId });
        await NotificationService.createNotification(
          {
            userId: id,
            message: `Room "${room.title}" was deleted by an admin`,
            type: 'RoomDeleted',
            roomId,
          },
          io
        );
      }

      await Room.findByIdAndDelete(roomId);
      Logger.info(`Room deleted by admin: ${roomId}`);
      return { message: 'Room deleted successfully by admin' };
    } catch (error) {
      Logger.error(`Failed to delete room by admin ${roomId}: ${error.message}`);
      throw error;
    }
  }

  async adminUpdateRoom(roomId, updateData, io) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (updateData.startTime && updateData.endTime &&
          new Date(updateData.startTime) >= new Date(updateData.endTime)) {
        throw new Error('End time must be after start time');
      }

      const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, {
        new: true,
        runValidators: true,
      })
        .populate('host', 'username email')
        .populate('participants', 'username email')
        .populate('invitedUsers', 'username email');

      const userIds = [
        ...room.participants.map((p) => p._id.toString()),
        room.host.toString(),
      ];
      for (const id of userIds) {
        io.to(`user-${id}`).emit('roomUpdate', updatedRoom);
        io.to(`room-${roomId}`).emit('roomUpdate', updatedRoom);
        await NotificationService.createNotification(
          {
            userId: id,
            message: `Room "${room.title}" was updated by an admin`,
            type: 'RoomUpdated',
            roomId,
          },
          io
        );
      }

      Logger.info(`Room updated by admin: ${roomId}`);
      return updatedRoom;
    } catch (error) {
      Logger.error(`Failed to update room by admin ${roomId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new RoomService();