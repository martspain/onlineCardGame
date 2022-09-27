const express = require('express');
const app = express();
const PORT = 8081
const ORIGIN = 'http://localhost:8080'
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: ORIGIN}});

const activeSessions = []

server.listen(PORT, () => {
  console.log('Server running...');
})

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  });

  socket.on('createSession', (session) => {
    socket.broadcast.emit('session', addActiveSession(session));
  })
  
  socket.on('closeSession', (session) => {
    socket.broadcast.emit('session', removeActiveSession(session));
  })

  socket.on('joinSession', (session) => {
    socket.broadcast.emit('session', updateActiveSession(session))
  })

  socket.on('getActiveSessions', () => {
    socket.emit('session', getCurrentActiveSessions())
  })
})

// ---------------
// Utils Functions
// ---------------

const addActiveSession = (newOne) => {
  activeSessions.push(newOne);
  return activeSessions;
}

const updateActiveSession = (currOne) => {
  activeSessions.map((elem) => {
    if (elem.id === currOne.id) {
      elem.players.push(currOne.players[0])
    }
    return;
  });
  return activeSessions;
}

const removeActiveSession = (oldOne) => {
  activeSessions.splice(activeSessions.findIndex((element) => element.id === oldOne.id), 1);
  return activeSessions;
}

const getCurrentActiveSessions = () => {
  return activeSessions;
}