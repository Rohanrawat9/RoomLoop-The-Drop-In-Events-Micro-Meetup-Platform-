const UserService = require('../services/user.service');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const user = await UserService.makeAdmin(req.params.id, req.user.id);
    res.json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};