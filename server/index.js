const express = require('express');
const app = express();
const PORT = 8081
const ORIGIN = 'http://localhost:8080'
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: ORIGIN}});

server.listen(PORT, () => {
  console.log('Server running...');
})

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
})