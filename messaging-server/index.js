const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Store connected users and their socket IDs
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user:join', (userId) => {
    users.set(socket.id, { id: userId, name: `User ${userId}` });
    io.emit('users:update', Array.from(users.values()));
    console.log(`User ${userId} joined`);
  });

  // Handle chat messages
  socket.on('chat:message', (message) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('chat:message', {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        text: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle typing status
  socket.on('user:typing', (isTyping) => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('user:typing', { userId: user.id, isTyping });
      console.log(`User ${user.id} is typing: ${isTyping}`);
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