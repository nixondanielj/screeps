var Communicator = require('services.communicator');

var comm = new Communicator();

console.log('Communicator Tests');

var id = 'needspickup';

comm.requestPickup(id);

var openPickups = comm.getOpenPickups();

console.log(openPickups.length === 1);
console.log(openPickups[0] === 'requests.pickup.' + id);

var fullPath = openPickups[0];
console.log(comm.isPickupOpen(fullPath));

console.log(comm.cancelPickup(id));

console.log(!comm.isPickupOpen(fullPath));

console.log(comm.getOpenPickups().length == 0);