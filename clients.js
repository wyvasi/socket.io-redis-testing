const { io } = require('socket.io-client');
const { portOne, portTwo } = require('./config');
const sockets = [];

// Creates 50 socket connections to localhost
(Array.from(Array(50).keys())).forEach((index) => {
    sockets.push(io(`ws://localhost:${(index % 2) ? portOne : portTwo }`));
});

const createEvents = (socket) => {
    // client-side
    socket.on('connect', () => {
        // console.log(`connected ${socket.id}`);
    });

    socket.on('disconnect', () => {});

    socket.on('emitter', (data) => {
        console.log(`Received message: ${socket.id}: ${data}`);
    });
};
// Listen on this sockets for events
sockets.forEach(socket => createEvents(socket));
