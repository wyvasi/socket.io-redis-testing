const { io } = require("socket.io-client");

const sockets = [];

(Array.from(Array(50).keys())).forEach((index) => {
    sockets.push(io('ws://localhost:3000'));
});

const createEvents = (socket) => {
    // client-side
    socket.on("connect", () => {
        console.log(`connected ${socket.id}`); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        console.log(`disconnected ${socket.id}`); // undefined
    });

    socket.on('emitter', (data) => {
        console.log(`socket ${socket.id}: ${data}`);
    });
};

sockets.forEach(socket => createEvents(socket));
