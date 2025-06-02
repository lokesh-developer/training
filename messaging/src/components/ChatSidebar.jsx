import React from 'react';

const ChatSidebar = ({ users, activeChat, onChatSelect, currentUser }) => {
  return (
    <div className="w-80 h-screen border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-medium">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Online Users</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${activeChat === user.id ? 'bg-blue-50' : ''}`}
              onClick={() => onChatSelect(user.id)}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.status}</p>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No other users online
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
