const jwt = require('jsonwebtoken');
const Logger = require('./logger');
const { jwtSecret } = require('../config/config');

const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: '1h' }
    );
  } catch (error) {
    Logger.error(`Failed to generate JWT: ${error.message}`);
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    Logger.error(`Failed to verify JWT: ${error.message}`);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
