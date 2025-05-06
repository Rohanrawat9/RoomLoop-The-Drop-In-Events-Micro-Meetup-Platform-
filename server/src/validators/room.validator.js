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

const validateAdminUpdateRoom = [
  param('id').isMongoId().withMessage('Invalid room ID'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('type').optional().isIn(['private', 'public']).withMessage('Type must be private or public'),
  body('startTime').optional().isISO8601().toDate().withMessage('Invalid start time'),
  body('endTime').optional().isISO8601().toDate().withMessage('Invalid end time'),
  body('maxParticipants').optional().isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

module.exports = {
  validateJoinRoom,
  validateLeaveRoom,
  validateInviteToRoom,
  validateUpdateStatuses,
  validateAdminUpdateRoom,
};