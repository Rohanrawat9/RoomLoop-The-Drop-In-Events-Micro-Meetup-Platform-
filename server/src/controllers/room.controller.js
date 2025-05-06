const Room = require('../models/room.model');
const RoomService = require('../services/room.service');

// Create a Room
exports.createRoom = async (req, res) => {
  try {
    const { title, description, type, startTime, endTime, maxParticipants, tags } = req.body;

    // Validate required fields
    if (!title || !description || !type || !startTime || !endTime) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate type
    if (!['private', 'public'].includes(type)) {
      return res.status(400).json({ error: 'Type must be private or public' });
    }

    // Validate time window
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const room = new Room({
      title,
      description,
      type,
      startTime,
      endTime,
      maxParticipants: maxParticipants || 10,
      tags: tags || [],
      host: req.user.id,
      participants: [],
      invitedUsers: [],
      status: 'Scheduled',
    });

    await room.save();
    const populatedRoom = await Room.findById(room._id)
      .populate('host', 'username email')
      .populate('participants', 'username email')
      .populate('invitedUsers', 'username email');
    res.status(201).json({ message: 'Room created successfully', room: populatedRoom });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room: ' + error.message });
  }
};

// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('host', 'username email')
      .populate('participants', 'username email')
      .populate('invitedUsers', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rooms: ' + error.message });
  }
};

// Get a Single Room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('host', 'username email')
      .populate('participants', 'username email')
      .populate('invitedUsers', 'username email');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve room: ' + error.message });
  }
};

// Update a Room
exports.updateRoom = async (req, res) => {
  try {
    const { title, description, type, startTime, endTime, maxParticipants, tags, status } = req.body;

    // Validate time window if provided
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Validate status if provided
    if (status && !['Scheduled', 'Live', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid room status' });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Restrict updates to the host
    if (room.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the host can update this room' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { title, description, type, startTime, endTime, maxParticipants, tags, status },
      { new: true, runValidators: true }
    )
      .populate('host', 'username email')
      .populate('participants', 'username email')
      .populate('invitedUsers', 'username email');

    res.json({ message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room: ' + error.message });
  }
};

// Delete a Room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Restrict deletion to the host
    if (room.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the host can delete this room' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room: ' + error.message });
  }
};

// Join a Room
exports.joinRoom = async (req, res) => {
  try {
    const room = await RoomService.joinRoom(req.params.id, req.user.id, req.io);
    res.json({ message: 'Joined room successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Leave a Room
exports.leaveRoom = async (req, res) => {
  try {
    const room = await RoomService.leaveRoom(req.params.id, req.user.id, req.io);
    res.json({ message: 'Left room successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Invite to a Room
exports.inviteToRoom = async (req, res) => {
  try {
    const { invitedUserIds } = req.body;
    const room = await RoomService.inviteToRoom(req.params.id, req.user.id, invitedUserIds, req.io);
    res.json({ message: 'Users invited successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Manually Update Room Statuses
exports.updateRoomStatuses = async (req, res) => {
  try {
    const updatedCount = await RoomService.updateRoomStatuses(req.io);
    res.json({ message: `Room statuses updated successfully. Checked ${updatedCount} rooms.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room statuses: ' + error.message });
  }
};

// Admin Delete Room
exports.adminDeleteRoom = async (req, res) => {
  try {
    const result = await RoomService.adminDeleteRoom(req.params.id, req.io);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin Update Room
exports.adminUpdateRoom = async (req, res) => {
  try {
    const { title, description, type, startTime, endTime, maxParticipants, tags } = req.body;
    const updatedRoom = await RoomService.adminUpdateRoom(req.params.id, {
      title,
      description,
      type,
      startTime,
      endTime,
      maxParticipants,
      tags,
    },
    req.io
  );
    res.json({ message: 'Room updated successfully by admin', room: updatedRoom });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
