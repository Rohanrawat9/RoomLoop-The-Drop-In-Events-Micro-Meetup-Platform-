const { param } = require('express-validator');

const validateGetUsers = [];

const validateMakeAdmin = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

module.exports = { validateGetUsers, validateMakeAdmin };