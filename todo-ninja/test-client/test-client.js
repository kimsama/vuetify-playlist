//
// test-client.js
//

const WebSocket = require('ws');

const ws = new WebSocket('ws://10.6.50.50:8080/ws');

ws.on('open', function open() {
  console.log('Connected');
});

ws.on('message', function incoming(data) {
  console.log(data);
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});
