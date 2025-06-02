const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST']
  }
});

// Store connected users and their socket IDs
const users = new Map();
// Store user conversations
const conversations = new Map();

function getConversationId(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join('-');
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user:join', ({ userId, name }) => {
    const user = { 
      id: userId, 
      name: name || `User ${userId}`,
      socketId: socket.id,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      status: 'online'
    };
    users.set(socket.id, user);
    io.emit('users:update', Array.from(users.values()));
    console.log(`User ${userId} joined`);
  });

  // Handle direct messages
  socket.on('chat:message', ({ recipientId, message }) => {
    const sender = users.get(socket.id);
    if (sender) {
      const conversationId = getConversationId(sender.id, recipientId);
      const messageData = {
        id: Date.now(),
        conversationId,
        senderId: sender.id,
        senderName: sender.name,
        recipientId,
        text: message,
        timestamp: new Date().toISOString()
      };

      // Store message in conversation history
      if (!conversations.has(conversationId)) {
        conversations.set(conversationId, []);
      }
      conversations.get(conversationId).push(messageData);

      // Send to recipient and sender
      const recipient = Array.from(users.values()).find(u => u.id === recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit('chat:message', messageData);
      }
      socket.emit('chat:message', messageData);
    }
  });

  // Handle conversation history request
  socket.on('conversation:history', ({ otherUserId }) => {
    const user = users.get(socket.id);
    if (user) {
      const conversationId = getConversationId(user.id, otherUserId);
      const history = conversations.get(conversationId) || [];
      socket.emit('conversation:history', history);
    }
  });

  // Handle typing status
  socket.on('user:typing', ({ recipientId, isTyping }) => {
    const user = users.get(socket.id);
    if (user) {
      const recipient = Array.from(users.values()).find(u => u.id === recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit('user:typing', { userId: user.id, isTyping });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('users:update', Array.from(users.values()));
      console.log(`User ${user.id} disconnected`);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});