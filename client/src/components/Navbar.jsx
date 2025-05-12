import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ title, onSearch }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    // Sample notifications from original code
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
  ]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-bell"></i>
            </button>
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onClear={clearNotifications}
              />
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;