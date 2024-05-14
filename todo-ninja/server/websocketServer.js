// server/websocketServer.js

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', socket => {
    console.log('A new client connected!');
    
    socket.on('message', message => {
        console.log('Received: %s', message);
        // You could trigger the addition of a v-expansion-panel here or send messages back
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });

    socket.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
