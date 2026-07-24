const Client = require('./client');

const clientA = new Client();
clientA.sendMessage('A')
  .then((data)=> { console.log(`[clientA] received: ${data}`);  return clientA.sendMessage('B');} )
  .then((data)=> { console.log(`[clientA] received: ${data}`);  return clientA.sendMessage('C');} )
  // .then((data)=> { console.log(`[clientA] received: ${data}`);  return clientA.sendMessage('exit');} )
  .catch((err) =>{ console.error(err); });

const clientB = new Client();
clientB.sendMessage('D')
  .then((data)=> { console.log(`[clientB] received: ${data}`);  return clientB.sendMessage('E');} )
  .then((data)=> { console.log(`[clientB] received: ${data}`);  return clientB.sendMessage('F');} )
  // .then((data)=> { console.log(`[clientB] received: ${data}`);  return clientB.sendMessage('exit');} )
  .catch((err) =>{ console.error(err); });
