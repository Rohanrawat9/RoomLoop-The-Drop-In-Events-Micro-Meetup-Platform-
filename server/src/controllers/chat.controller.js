const ChatService = require('../services/chat.service');

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await ChatService.sendMessage(
      req.params.id,
      req.user.id,
      content,
      req.io // Pass Socket.IO instance
    );
    res.json({ message: 'Message sent successfully', message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatService.getMessages(req.params.id, req.user.id);
    res.json({ message: 'Messages fetched successfully', messages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};