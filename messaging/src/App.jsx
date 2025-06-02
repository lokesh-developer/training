import { useEffect, useState, useCallback } from 'react'
import ChatSidebar from './components/ChatSidebar'
import ChatWindow from './components/ChatWindow'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3000');

function App() {
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser] = useState({
    id: Math.random().toString(36).substr(2, 9),
    name: `User_${Math.random().toString(36).substr(2, 4)}`
  });
  const [connectedUsers, setConnectedUsers] = useState([])

  const [messages, setMessages] = useState([])

  const handleSendMessage = useCallback((message) => {
    if (message.trim() && activeChat) {
      socket.emit('chat:message', {
        recipientId: activeChat,
        message: message.trim()
      });
    }
  }, [activeChat])

  useEffect(() => {
    // Join the chat with user info
    socket.emit('user:join', {
      userId: currentUser.id,
      name: currentUser.name
    });

    // Handle connected users updates
    socket.on('users:update', (users) => {
      setConnectedUsers(users.filter(user => user.id !== currentUser.id));
    });

    // Handle incoming messages
    socket.on('chat:message', (message) => {
      if (message.senderId === activeChat || message.recipientId === activeChat) {
        setMessages(prev => [...prev, {
          id: message.id,
          name: message.senderName,
          text: message.text,
          time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSent: message.senderId === currentUser.id
        }]);
      }
    });

    // Handle conversation history
    socket.on('conversation:history', (history) => {
      const formattedMessages = history.map(msg => ({
        id: msg.id,
        name: msg.senderName,
        text: msg.text,
        time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: msg.senderId === currentUser.id
      }));
      setMessages(formattedMessages);
    });

    // Handle user typing status
    socket.on('user:typing', ({ userId, isTyping }) => {
      if (userId === activeChat) {
        // You can implement typing indicator here
        console.log(`User ${userId} is ${isTyping ? 'typing' : 'not typing'}`);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('users:update');
      socket.off('chat:message');
      socket.off('conversation:history');
      socket.off('user:typing');
    };
  }, [currentUser.id, currentUser.name, activeChat]);

  // Load conversation history when changing active chat
  useEffect(() => {
    if (activeChat) {
      setMessages([]); // Clear current messages
      socket.emit('conversation:history', { otherUserId: activeChat });
    }
  }, [activeChat]);

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        users={connectedUsers}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        currentUser={currentUser}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default App
