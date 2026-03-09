const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Users can join a room matching their ID (for private notifications)
    socket.on('joinRoom', ({ userId, role }) => {
      socket.join(userId);
      if (role) {
        socket.join(role); // e.g., 'Admin', 'Engineer'
      }
      console.log(`Socket ${socket.id} joined room ${userId} and role ${role}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
