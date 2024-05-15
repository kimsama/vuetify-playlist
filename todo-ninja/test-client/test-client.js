//
// test-client.js
//

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  // Send identification message to the server
  ws.send(JSON.stringify({
    type: 'identify',
    clientType: 'normal-client'
  }));
});

ws.on('message', (data) => {
  console.log('Message from server:', data);
});
