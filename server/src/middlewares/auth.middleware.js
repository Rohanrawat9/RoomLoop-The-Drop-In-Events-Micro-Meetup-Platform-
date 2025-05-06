const Logger = require('../utils/logger');
const { verifyToken } = require('../utils/jwt');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  // Retrieve token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Log warning when token is missing
    Logger.warn('No token provided in request.');
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);
    
    // Attach user info to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log error in case of an invalid token
    Logger.error(`Invalid token error: ${error.message}`);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = { authMiddleware };
