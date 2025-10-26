const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('connected');
  socket.emit('ping', { message: 'Hello from client' });
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

socket.on('pong', (data) => {
  console.log('pong received', data);
});
