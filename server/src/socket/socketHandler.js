const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');
const Room = require('../models/room.model');

const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      Logger.error(`Socket auth error: ${error.message}`);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    Logger.info(`User ${socket.user.id} connected via Socket.IO`);
    socket.emit('test', 'Socket connected');  //Test event

    socket.join(`user-${socket.user.id}`);

    Room.find({
      $or: [
        { host: socket.user.id },
        { participants: socket.user.id },
        { invitedUsers: socket.user.id },
      ],
    })
      .then((rooms) => {
        rooms.forEach((room) => {
          socket.join(`room-${room._id}`);
          Logger.info(`User ${socket.user.id} joined room-${room._id}`);
        });
      })
      .catch((error) => {
        Logger.error(`Error joining rooms for user ${socket.user.id}: ${error.message}`);
      });

    socket.on('joinRoom', (roomId) => {
      Room.findById(roomId)
        .then((room) => {
          if (!room) {
            socket.emit('error', 'Room not found');
            return;
          }
          if (
            room.host.toString() === socket.user.id ||
            room.participants.includes(socket.user.id) ||
            room.invitedUsers.includes(socket.user.id)
          ) {
            socket.join(`room-${roomId}`);
            Logger.info(`User ${socket.user.id} joined room-${roomId}`);
            socket.emit('joinedRoom', roomId);
          } else {
            socket.emit('error', 'Not authorized to join this room');
          }
        })
        .catch((error) => {
          Logger.error(`Error joining room ${roomId}: ${error.message}`);
          socket.emit('error', 'Server error');
        });
    });

    socket.on('disconnect', () => {
      Logger.info(`User ${socket.user.id} disconnected`);
    });
  });
};

module.exports = { initializeSocket };