import socketIOClient from 'socket.io-client'

const ENDPOINT = 'https://card-jitsu-uvg.herokuapp.com/'
const socket = socketIOClient(ENDPOINT)

socket.on('connection');

export default socket;
