const { portOne } = require('./config');
const { getServer } = require('./libs/server');
// const io = new Server();
const socketsList = [];

let io;

(async() => {
    io = await getServer(portOne);

    io.on('connect', (socket) => {
        socket.join('hello');
        // console.log(`connected ${socket.id}`);
    });

    io.on('get-clients', (data) => {
        io.emit('emitter', 'Message broadcasted from get-clients!');
    });
})();

let counter = 0;
setInterval(async () => {
    // // Rejoin sockets in room
    // if (counter++ % 2) {
    //     await io.in(socketsList).socketsJoin('hello');
    //     socketsList.length = 0;
    // }
    // Get sockets from room
    const sockets = await io.in("hello").fetchSockets();
    console.log(`List with sockets connected to hello room: ${sockets.length}`);
    // // Leave sockets from room
    // let i = 0;
    // sockets.forEach(socket => {
    //     if (i++ < 10) {
    //         io.in(socket.id).socketsLeave('hello');
    //         socketsList.push(socket.id);
    //     }
    // });
}, 15000);
