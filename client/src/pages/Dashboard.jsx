import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import NotificationPanel from '../components/NotificationPanel';

const sampleRooms = [
  // Sample rooms data (same as provided in the original code)
  {
    id: 1,
    name: 'Design Sprint',
    description: 'Weekly design team collaboration',
    type: 'collaboration',
    status: 'active',
    members: 12,
    maxMembers: 20,
    duration: '2h 15m',
    online: 5,
    rating: 4.8,
    owner: 'Sarah Johnson',
    ownerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: 'indigo',
    isRecommended: true,
    isMine: true,
    lastActivity: '2 hours ago',
  },
  // ... other rooms
];

const sampleNotifications = [
  // Sample notifications data (same as provided)
  {
    id: 1,
    type: 'mention',
    message: 'Sarah Johnson mentioned you in a comment in Design Sprint',
    time: '2 hours ago',
    read: false,
    icon: 'fa-comment',
    iconColor: 'indigo',
  },
  // ... other notifications
];

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rooms, setRooms] = useState(sampleRooms);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
  const handleJoinRoom = (room) => navigate(`/room/${room.id}`);
  const handleSearch = (query) => console.log(`Searching for: ${query}`);
  const handleClearNotifications = () => setNotifications([]);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  return (
    <>
      <div
        className={`sidebar ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} bg-white shadow-lg flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-door-open text-indigo-600 text-2xl"></i>
            {isSidebarExpanded && <span className="text-xl font-bold text-gray-800">RoomLoop</span>}
          </div>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <i className={`fas ${isSidebarExpanded ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              {isSidebarExpanded && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</h3>
              )}
              <ul>
                <li className="mb-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 w-full text-left"
                  >
                    <i className="fas fa-home mr-3 text-indigo-500"></i>
                    {isSidebarExpanded && <span>Dashboard</span>}
                  </button>
                </li>
                <li className="mb-1">
                  <button className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 w-full text-left">
                    <i className="fas fa-compass mr-3 text-indigo-500"></i>
                    {isSidebarExpanded && <span>Explore</span>}
                  </button>
                </li>
                <li className="mb-1">
                  <button className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 w-full text-left">
                    <i className="fas fa-comments mr-3 text-indigo-500"></i>
                    {isSidebarExpanded && <span>My Rooms</span>}
                  </button>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              {isSidebarExpanded && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h3>
              )}
              <button
                onClick={() => navigate('/create-room')}
                className="w-full flex items-center justify-center p-2 mb-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <i className="fas fa-plus mr-2"></i>
                {isSidebarExpanded && <span>Create Room</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`main-content flex-1 flex flex-col overflow-hidden ${!isSidebarExpanded ? 'ml-16' : ''}`}>
        <Navbar title="Dashboard" onSearch={handleSearch} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="gradient-bg rounded-xl p-6 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
            <p className="mb-4">Join or create a room to start collaborating with your team.</p>
            <button
              onClick={() => navigate('/create-room')}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
            >
              Create New Room
            </button>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Active Rooms</h2>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.filter((room) => room.isMine && room.status === 'active').map((room) => (
                <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
              ))}
            </div>
          </div>
          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClear={handleClearNotifications}
              onToggle={toggleNotifications}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;