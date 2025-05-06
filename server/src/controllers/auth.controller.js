const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret: JWT_SECRET } = require('../config/config');
const User = require('../models/user.model');
const logger = require('../utils/logger');

// Fail-fast if JWT_SECRET is not set
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is undefined. Please check your .env and config.js setup.');
}

// Sign-up function
const signUp = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username.' });
    }

    const user = new User({ email, username, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`New user created: ${username} (${email})`);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username, email },
    });
  } catch (err) {
    logger.error(`signUp error: ${err.stack}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in: ${user.username} (${email})`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email },
    });
  } catch (err) {
    logger.error(`login error: ${err.stack}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { signUp, login };
