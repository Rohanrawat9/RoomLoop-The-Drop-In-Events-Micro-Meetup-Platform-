const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/user.model');

// Sign-up function
const signUp = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username.' });
    }

    // Create new user
    const user = new User({
      email,
      username,
      password, // Will be hashed by the schema's pre-save hook
    });

    await user.save();

    // Debug JWT_SECRET
    console.log('signUp - JWT_SECRET:', JWT_SECRET);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username, email },
    });
  } catch (err) {
    console.error('signUp error:', err.stack); // Debug
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Debug JWT_SECRET
    console.log('login - JWT_SECRET:', JWT_SECRET);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email },
    });
  } catch (err) {
    console.error('login error:', err.stack); // Debug
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { signUp, login };