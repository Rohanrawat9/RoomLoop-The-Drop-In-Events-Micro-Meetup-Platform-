import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';

const sampleChatMessages = [
  {
    sender: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    message: "Hey team! Let's start with reviewing the designs.",
    time: '2:34 PM',
    isCurrentUser: false,
  },
  // ... other messages
];

function RoomView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(sampleChatMessages);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const handleSendMessage = (message) => {
    const newMessage = {
      sender: 'You',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    alert(`Microphone ${!isMuted ? 'muted' : 'unmuted'}`);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    alert(`Video ${!isVideoOn ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Room {id}</h3>
            <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-cube text-6xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">3D Room View</p>
              </div>
            </div>
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
          </div>
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-2">
              {/* Participants */}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 ${isMuted ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500'} hover:text-gray-700 bg-white rounded-full shadow-sm`}
              >
                <i className="fas fa-microphone"></i>
              </button>
              <button
                onClick={toggleVideo}
                className={`p-2 ${isVideoOn ? 'text-indigo-600 bg-indigo-100' : 'text-gray-500'} hover:text-gray-700 bg-white rounded-full shadow-sm`}
              >
                <i className="fas fa-video"></i>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm">
                <i className="fas fa-share-square"></i>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-white bg-red-500 rounded-full shadow-sm hover:bg-red-600"
              >
                <i className="fas fa-phone-slash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomView;