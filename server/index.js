const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081
const ORIGIN = 'http://localhost:8080'
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: ORIGIN}});
const path = require('path')

app.use(express.static(path.join(__dirname + "/public")))

const activeSessions = []
const gameTurns = []
const badgesEarned = []

server.listen(PORT, () => {
  console.log('Server running...');
})

io.on('connection', (socket) => {
  // console.log('User connected: ', socket.id);

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
    socket.broadcast.emit('session', updateActiveSession(session));
  })

  socket.on('getActiveSessions', () => {
    socket.emit('session', getCurrentActiveSessions());
  })
  
  socket.on('addGameTurn', (turn) => {
    socket.emit('gameTurn', addGameTurns(turn));
    socket.broadcast.emit('gameTurn', gameTurns);
  })

  socket.on('startGame', (startin) => {
    socket.broadcast.emit('startGame', startin);
  })

  socket.on('cleanTurn', (sessionInfo) => {
    socket.emit('gameTurn', cleanUpTurns(sessionInfo));
  })

  socket.on('gameOver', (gameInfo) => {
    socket.broadcast.emit('gameOver', cleanUpSession(gameInfo));
  })

  socket.on('badgeEarned', (data) => {
    socket.emit('badgeEarned', addBadgeEarned(data));
    socket.broadcast.emit('badgeEarned', badgesEarned);
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

const addGameTurns = (newOne) => {
  gameTurns.push(newOne);
  return gameTurns;
}

const cleanUpTurns = (sessionInfo) => {
  gameTurns.forEach((turn, index) => {
    if (turn.session === sessionInfo.session){
      gameTurns.splice(index, 1);
    }
  })
  return gameTurns;
}

const cleanUpSession = (sessionInfo) => {
  activeSessions.splice(activeSessions.findIndex((element) => element.id === sessionInfo.session), 1);
  return sessionInfo;
}

const addBadgeEarned = (data) => {
  badgesEarned.push(data);
  return badgesEarned;
}