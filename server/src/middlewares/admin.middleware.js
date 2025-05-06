const User = require('../models/user.model');
const Logger = require('../utils/logger');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      Logger.warn(`Unauthorized admin access attempt by user ${req.user.id}`);
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    Logger.error(`Admin middleware error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { adminMiddleware };