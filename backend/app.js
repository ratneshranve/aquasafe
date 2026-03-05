require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const socketIoSetup = require('./socket');
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const engineerRoutes = require('./routes/engineerRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = socketIoSetup(server);

// Middleware
app.use(cors());
app.use(express.json());

// Expose io to all routes if needed, though better just to pass it around.
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensor-data', sensorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/engineer', engineerRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Trigger nodemon restart
// Trigger nodemon restart 2
