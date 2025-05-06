const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Logger = require('../utils/logger');

class AuthService {
  async signupUser({ username, email, password }) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = this.generateToken(user);
      Logger.info(`User signed up: ${email}`);
      return { user, token };
    } catch (error) {
      Logger.error(`Signup error: ${error.message}`);
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      Logger.info(`Attempting login for email: ${email}`);
      const user = await User.findOne({ email });
      if (!user) {
        Logger.warn(`User not found for email: ${email}`);
        throw new Error('Invalid credentials');
      }
  
      Logger.info(`User found: ${user._id}, checking password`);
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        Logger.warn(`Password mismatch for email: ${email}`);
        throw new Error('Invalid credentials');
      }
  
      Logger.info(`Generating token for user: ${user._id}`);
      const token = this.generateToken(user);
      Logger.info(`User logged in: ${email}`);
      return { user, token };
    } catch (error) {
      Logger.error(`Login error for ${email}: ${error.message}, Stack: ${error.stack}`);
      throw error;
    }
  }
}

module.exports = new AuthService();