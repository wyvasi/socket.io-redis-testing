
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Emitter } = require("@socket.io/redis-emitter");
const { getClient } = require("./libs/redis");
const { redisUrl, key, portOne } = require('./config');
const io = new Server();
const socketsList = [];

Promise.all([getClient(redisUrl), getClient(redisUrl)])
    .then(([pubClient, subClient]) => {
        io.adapter(createAdapter(pubClient, subClient, { key }));
        io.listen(portOne);

        io.on('get-clients', (data) => {
            io.emit('emitter', 'Message broadcasted from get-clients!');
        });
        // const emitter = new Emitter(pubClient, { key });

        // setInterval(() => {
        //     emitter.to('hello').emit("emitter", (new Date).valueOf());
        // }, 2500);
    });


let counter = 0;
setInterval(async () => {
    // Rejoin sockets in room
    if (counter++ % 2) {
        await io.in(socketsList).socketsJoin('hello');
        socketsList.length = 0;
    }
    // Get sockets from room
    const sockets = await io.in("hello").fetchSockets();
    console.log(`List with sockets connected to hello room: ${sockets.length}`);
    // Leave sockets from room
    let i = 0;
    sockets.forEach(socket => {
        if (i++ < 10) {
            io.in(socket.id).socketsLeave('hello');
            socketsList.push(socket.id);
        }
    });
}, 10000);
