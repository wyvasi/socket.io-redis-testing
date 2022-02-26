const { io } = require('socket.io-client');
const { portOne, portTwo } = require('./config');
const sockets = [];

// Creates x socket connections to localhost
(Array.from(Array(10).keys())).forEach((index) => {
    sockets.push(io(`ws://localhost:${(index % 2) ? portOne : portTwo }`));
});

let numberOfEventsReceived = 0;

const createEvents = (socket) => {
    // client-side
    socket.on('connect', () => {
        // console.log(`connected ${socket.id}`);
    });

    socket.on('disconnect', () => {});

    socket.on('emitter', (data) => {
        console.log(`Received message: ${socket.id}: ${data}`);
        // socket.emit('')
        numberOfEventsReceived++;
    });
};
// Listen on this sockets for events
sockets.forEach(socket => createEvents(socket));

//clear every 13 Seconds the number of events received
setInterval(() => {
    console.log(`Clients on this node received ${numberOfEventsReceived} in last 13 seconds`);
    numberOfEventsReceived = 0;
}, 13000);