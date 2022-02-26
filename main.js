
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { getClient } = require('./libs/redis');
const { redisUrl, key, portTwo } = require('./config');

const io = new Server({});

Promise.all([getClient(redisUrl), getClient(redisUrl)])
    .then(([pubClient, subClient]) => {
        io.adapter(createAdapter(pubClient, subClient, { key }));
        io.listen(portTwo);
    });

io.on('connect', (socket) => {
    socket.join('hello');
    // console.log(`connected ${socket.id}`);
});

io.on('disconnect', (socket) => {
    // console.log(`disconected ${socket.id}`);
});

io.on('main', (data) => {
    io.emit('emitter', 'Message broadcasted from main!');
});

let x = 0;

setInterval(() => {
    io.to('test').emit('testing', {
        number: x++,
    });
}, 3500);
