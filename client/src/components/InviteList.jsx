const InviteList = ({ participants = [] }) => {
    return (
      <div className="flex items-center space-x-2">
        {participants.map((participant) => (
          <div key={participant.id} className="relative">
            <img
              src={participant.avatar}
              className="w-8 h-8 rounded-full"
              alt="User"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
          </div>
        ))}
        {participants.length < 5 && (
          <span className="text-sm text-gray-500">+{5 - participants.length} more</span>
        )}
      </div>
    );
  };
  
  export default InviteList;