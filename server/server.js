const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock data
let computers = [
  { id: 'pc-1', name: 'ПК-01', type: 'ПК', status: 'occupied', position: { row: 0, col: 0 } },
  { id: 'pc-2', name: 'ПК-02', type: 'ПК', status: 'free', position: { row: 0, col: 1 } },
  // Add more computers...
];

let users = [
  { id: 'u1', name: 'Иван Петров', competenceLevel: 'Средний', group: 'ИТ-21' },
  { id: 'u2', name: 'Мария Сидорова', competenceLevel: 'Продвинутый', group: 'ИТ-22' },
  // Add more users...
];

let logs = [];

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('initial_data', { computers, users, logs });
  
  // Handle computer status updates
  socket.on('update_computer_status', (data) => {
    const { computerId, status, userId } = data;
    const computer = computers.find(c => c.id === computerId);
    
    if (computer) {
      computer.status = status;
      if (userId) {
        const user = users.find(u => u.id === userId);
        computer.currentUser = user;
        computer.sessionStartTime = new Date();
      } else {
        computer.currentUser = undefined;
        computer.sessionStartTime = undefined;
      }
      
      // Add log entry
      const logEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: status === 'occupied' ? 'user_login' : 'user_logout',
        computerId,
        userId,
        message: status === 'occupied' 
          ? `Пользователь ${computer.currentUser?.name} сел за ${computer.name}`
          : `Пользователь покинул ${computer.name}`,
        severity: 'info'
      };
      
      logs.unshift(logEntry);
      logs = logs.slice(0, 100); // Keep last 100 logs
      
      // Broadcast update to all clients
      io.emit('computer_updated', computer);
      io.emit('log_added', logEntry);
    }
  });
  
  // Handle user management
  socket.on('add_user', (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date()
    };
    users.push(newUser);
    io.emit('user_added', newUser);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API endpoints
app.get('/api/computers', (req, res) => {
  res.json(computers);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.get('/api/statistics', (req, res) => {
  const stats = {
    totalComputers: computers.length,
    occupiedComputers: computers.filter(c => c.status === 'occupied').length,
    freeComputers: computers.filter(c => c.status === 'free').length,
    maintenanceComputers: computers.filter(c => c.status === 'maintenance').length,
    totalUsers: users.length,
    activeSessions: computers.filter(c => c.status === 'occupied').length,
    averageSessionTime: 45
  };
  res.json(stats);
});

// Simulate real-time updates
setInterval(() => {
  // Random status changes
  const randomComputer = computers[Math.floor(Math.random() * computers.length)];
  if (randomComputer.status === 'free' && Math.random() > 0.7) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    randomComputer.status = 'occupied';
    randomComputer.currentUser = randomUser;
    randomComputer.sessionStartTime = new Date();
    
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'user_login',
      computerId: randomComputer.id,
      userId: randomUser.id,
      message: `Пользователь ${randomUser.name} сел за ${randomComputer.name}`,
      severity: 'info'
    };
    
    logs.unshift(logEntry);
    logs = logs.slice(0, 100);
    
    io.emit('computer_updated', randomComputer);
    io.emit('log_added', logEntry);
  }
}, 10000); // Every 10 seconds

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
