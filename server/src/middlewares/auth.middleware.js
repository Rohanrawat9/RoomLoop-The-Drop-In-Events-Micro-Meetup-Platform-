const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    console.log('authMiddleware - JWT_SECRET:', JWT_SECRET); // Debug
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (error) {
    console.error('authMiddleware error:', error.stack); // Debug
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = { authMiddleware };