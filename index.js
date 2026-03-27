require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = require('./sockets').init(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes Files
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const path = require('path');

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/facilities', facilityRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('SehatSetu Backend API is running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Socket.io for Real-time Notifications
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Real-time events will be added here
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
