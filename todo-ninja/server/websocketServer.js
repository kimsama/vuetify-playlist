//
// server/websocketServer.js
// 

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const monitoringClient = new Set(); // Dedicated set for monitoring clients (only one expected)
const normalClients = new Set();    // Set for all other normal clients

function broadcastToNormalClients(message) {
    normalClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function sendToMonitoringClient(message) {
    monitoringClient.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function updateMonitoringClient() {
    const allClients = Array.from(normalClients).map(client => ({
        ip: client.ip,
        id: client.id
    }));

    const updateMessage = JSON.stringify({
        type: 'updateClients',
        clients: allClients
    });

    console.log("Sending update to monitoring client:", updateMessage);
    sendToMonitoringClient(updateMessage);
}

server.on('connection', (socket, req) => {
    const clientIp = req.socket.remoteAddress;

    // Listen for identification message
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'identify') {
            socket.clientType = data.clientType;
            socket.ip = clientIp;
            socket.id = Date.now() + Math.random();

            if (data.clientType === 'monitoring-client') {
                monitoringClient.add(socket);
                console.log(`Monitoring client connected: ${clientIp}`);
            } else {
                normalClients.add(socket);
                console.log(`Normal client connected: ${clientIp}`);
            }

            socket.send(JSON.stringify({
                type: 'connection-acknowledged',
                ip: clientIp,
                id: socket.id,
                message: 'Connection established and type acknowledged.'
            }));

            // Update monitoring client about all connections
            updateMonitoringClient();
        } else {
            // Other message handling
            console.log(`Received from ${socket.clientType}:`, message);
        }
    });

    socket.on('close', () => {
        if (socket.clientType === 'monitoring-client') {
            monitoringClient.delete(socket);
            console.log(`Monitoring client disconnected: ${clientIp}`);
        } else {
            normalClients.delete(socket);
            console.log(`Normal client disconnected: ${clientIp}`);
            updateMonitoringClient();
        }
    });

    socket.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
