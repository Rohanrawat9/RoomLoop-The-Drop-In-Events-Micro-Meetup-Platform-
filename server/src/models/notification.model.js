// src/models/notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['Invitation', 'StatusChange', 'ParticipantJoined'],
    required: true,
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, // Optional, for room-related notifications
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
