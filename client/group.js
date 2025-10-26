const group = io('http://localhost:3000/group');
group.on('connect', () => {
  group.emit('list', { message: 'send group list' });

  group.on('list', (data) => {
    console.log('Group list', data);
  });
});
