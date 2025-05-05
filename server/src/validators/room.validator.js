const mongoose = require('mongoose');
const { body, param } = require('express-validator');



const validateJoinRoom = [
  param('id').isMongoId().withMessage('Invalid room ID'),
];

const validateLeaveRoom = [
  param('id').isMongoId().withMessage('Invalid room ID'),
];

const validateInviteToRoom = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('invitedUserIds')
    .isArray({ min: 1 }).withMessage('At least one user ID is required')
    .custom((value) => value.every((id) => mongoose.Types.ObjectId.isValid(id)))
    .withMessage('All invited user IDs must be valid MongoDB ObjectIds'),
];

const validateUpdateStatuses = []; // No validation needed for now

module.exports = {
  validateJoinRoom,
  validateLeaveRoom,
  validateInviteToRoom,
  validateUpdateStatuses,
};