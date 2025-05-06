// src/middlewares/error.middleware.js
const Logger = require('../utils/logger');
const errorMiddleware = (err, req, res, next) => {
  Logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
    console.error(err);  // Log error details to the console (can replace with a logging library)
  
    // If the error is a validation error (e.g., from Mongoose validation)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    // Check for duplicate key error (common in MongoDB)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error.' });
    }
  
    // For all other errors, send a generic internal server error
    return res.status(500).json({ message: 'Internal Server Error' });
  };
  
  module.exports = { errorMiddleware };
  