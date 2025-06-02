import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

const ChatWindow = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      setIsTyping(false);
      socket.emit('user:typing', false);
    }
  };

  useEffect(() => {
    let typingTimer;
    if (newMessage) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('user:typing', true);
      }
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        socket.emit('user:typing', false);
      }, 1000);
    } else {
      setIsTyping(false);
      socket.emit('user:typing', false);
    }

    return () => clearTimeout(typingTimer);
  }, [newMessage, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <img
            src={messages[0]?.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-lg font-semibold">{messages[0]?.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Start a conversation...</p>
          </div>
        ) : (
          <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isSent ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isSent
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {message.time}
                </span>
              </div>
            </div>
          ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 transition-colors"

          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
