//
// server/websocketServer.js
// 

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`New client connected: ${clientIp}`);

    // Send a connection notification message immediately
    const message = JSON.stringify({
        type: 'newClient',
        ip: clientIp,
        message: 'Connection established'
    });
    socket.send(message); // Send notification right after connection

    socket.on('message', (message) => {
        console.log('Received:', message);
        // Echo the received message back to the client
        socket.send(JSON.stringify({ type: 'echo', payload: message }));
    });

    socket.on('close', () => {
        console.log(`Client ${clientIp} disconnected`);
    });

    socket.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
