// Log environment variables for debugging
module.exports = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET,
};