const RoomCard = ({ room, onJoin, onEdit, onArchive, showActions = false }) => {
    const statusColor = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
  
    return (
      <div
        className="room-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
        onClick={() => onJoin(room)}
      >
        <div className={`relative h-40 bg-${room.color}-100`}>
          <div className="room-overlay absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
              Join Room
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.online} members online</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColor[room.status]}`}>
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </span>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <i className="fas fa-user-friends mr-1"></i>
            <span>
              {room.members}/{room.maxMembers}
            </span>
            <span className="mx-2">•</span>
            <i className="fas fa-clock mr-1"></i>
            <span>{room.duration}</span>
          </div>
          {showActions && (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(room);
                }}
                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700"
              >
                <i className="fas fa-edit mr-1"></i> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(room);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300"
              >
                <i className="fas fa-archive mr-1"></i>
                {room.status === 'archived' ? 'Restore' : 'Archive'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default RoomCard;