'use strict';

// load the Node.js TCP library
const net = require('net');
const PORT = 1234;
const HOST = 'localhost';

class Server {
 constructor(port, address) {
  this.port = port || PORT;
  this.address = address || HOST;

  this.init();
 }

 init() {
  let server = this;

  let onClientConnected = (sock) => {

   let clientName = `${sock.remoteAddress}:${sock.remotePort}`;
   console.log(`[Server] new client connected: ${clientName}`);

   sock.on('data', (data) => {
    console.log(`${clientName} Says: ${data}`);
    sock.write(data);
    // sock.write('exit');
   });

   sock.on('close', () => {
    console.log(`[Server] connection from ${clientName} closed`);
   });

   sock.on('error', (err) => {
    console.log(`[Server] connection ${clientName} error: ${err.message}`);
   });
  }

  server.connection = net.createServer(onClientConnected);

  server.connection.listen(PORT, HOST, function() {
   console.log(`[Server] started at: ${HOST}:${PORT}`);
  });
 }
}

module.exports = Server;