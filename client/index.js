const socket = io('http://localhost:3000', {
  auth: {
    token: '123',
  },
  query: {
    token: '456',
  },
});

socket.on('connect', () => {
  console.log('connected');
});

const roomName = prompt('Enter room name', 'nest-js');
const username = prompt('Enter your name', 'mehrdad samadi');

let messages = [];

socket.on('client-chat', (data) => {
  const { user, time, message: serverMessage } = data;

  const message = `<div class=${username === user.username ? 'outgoing-chats' : 'received-chats'}>
            <div class=${username === user.username ? 'outgoing-msg' : 'received-msg'}>
              <div class=${username === user.username ? 'outgoing-chats-msg' : 'received-msg-inbox'}>
                <p class="multi-msg">${serverMessage}</p>
                <span class="time">${time}</span>
              </div>
            </div>
          </div>`;

  messages.push(message);
  document.getElementById('msg-page').innerHTML = messages.join('');
});

const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');
const usernameTag = document.getElementById('username');

usernameTag.innerText = username;

sendBtn.addEventListener('click', () => {
  const msg = msgInput.value;

  if (roomName && username) {
    socket.emit('join-room', {
      roomName,
      user: { username, socketId: socket.id },
    });

    socket.emit('server-chat', {
      roomName,
      user: {
        username,
        socketId: socket.id,
      },
      message: msg,
      time: new Date().toISOString(),
    });

    msgInput.value = '';
  } else {
    alert('please enter room name and username');
  }
});

socket.on('exception', (data) => {
  console.log('exception', data);
});

socket.on('disconnect', () => {
  console.log('disconnected');
});
