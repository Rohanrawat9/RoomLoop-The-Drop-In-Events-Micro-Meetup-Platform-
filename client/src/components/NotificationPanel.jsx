const NotificationPanel = ({ notifications, onClear }) => {
    return (
      <div className="fixed right-4 top-16 w-80 bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <button
            onClick={onClear}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear All
          </button>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 flex items-start">
              <div
                className={`bg-${notification.iconColor}-100 p-3 rounded-full mr-4`}
              >
                <i
                  className={`fas ${notification.icon} text-${notification.iconColor}-600`}
                ></i>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm text-gray-800 ${
                    !notification.read ? 'font-semibold' : ''
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default NotificationPanel;