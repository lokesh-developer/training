import React from 'react';

const ChatSidebar = ({ conversations, activeChat, onChatSelect }) => {
  return (
    <div className="w-80 h-screen border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              activeChat === chat.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
