import { useState } from 'react';

const ChatPanel = ({ messages = [], onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium">Chat</h4>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message fade-in">
            {msg.isCurrentUser ? (
              <div className="flex items-start justify-end">
                <div className="bg-indigo-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">{msg.message}</p>
                  <p className="message-time text-xs text-gray-500 mt-1 opacity-0 transition">
                    {msg.time}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <img
                  src={msg.avatar}
                  className="w-8 h-8 rounded-full mr-3"
                  alt="User"
                />
                <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">{msg.message}</p>
                  <p className="message-time text-xs text-gray-500 mt-1 opacity-0 transition">
                    {msg.time}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;