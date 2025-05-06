const User = require('../models/user.model');
const Logger = require('../utils/logger');

class UserService {
  async getAllUsers() {
    try {
      const users = await User.find().select('username email isAdmin');
      Logger.info('Fetched all users for admin');
      return users;
    } catch (error) {
      Logger.error(`Failed to fetch all users: ${error.message}`);
      throw error;
    }
  }

  async makeAdmin(userId, adminId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (user.isAdmin) {
        throw new Error('User is already an admin');
      }

      const admin = await User.findById(adminId);
      if (!admin || !admin.isAdmin) {
        throw new Error('Only admins can promote users to admin');
      }

      user.isAdmin = true;
      await user.save();
      Logger.info(`User ${userId} promoted to admin by ${adminId}`);
      return { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin };
    } catch (error) {
      Logger.error(`Failed to make user ${userId} admin: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserService();