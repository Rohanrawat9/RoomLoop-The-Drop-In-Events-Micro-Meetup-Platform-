const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateJoinRoom, validateLeaveRoom, validateInviteToRoom } = require('../validators/room.validator');
const { validate } = require('../middlewares/validate.middleware');

// Create a Room (Protected)
router.post('/', authMiddleware, roomController.createRoom);

// Get all Rooms (Public)
router.get('/', roomController.getRooms);

// Get a single Room (Public)
router.get('/:id', roomController.getRoomById);

// Update a Room (Protected, Host only)
router.put('/:id', authMiddleware, roomController.updateRoom);

// Delete a Room (Protected, Host only)
router.delete('/:id', authMiddleware, roomController.deleteRoom);

// Join a Room (Protected)
router.post('/:id/join', authMiddleware, validateJoinRoom, validate, roomController.joinRoom);

// Leave a Room (Protected)
router.post('/:id/leave', authMiddleware, validateLeaveRoom, validate, roomController.leaveRoom);

// Invite to a Room (Protected, Host only)
router.post('/:id/invite', authMiddleware, validateInviteToRoom, validate, roomController.inviteToRoom);

// Manually Update Room Statuses (Protected, Admin only - for testing)
router.post('/update-status', authMiddleware, roomController.updateRoomStatuses);

module.exports = router;