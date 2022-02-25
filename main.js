
const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const {createClient} = require("redis");
const {redisUrl, key, portTwo} = require('./config');

const io = new Server({});

const pubClient = createClient({ url: redisUrl });
pubClient.on('connect', () => console.log('Connected to REDIS!'));
pubClient.on('error', (err) => console.log('Error connecting to REDIS: ', err));

const subClient = pubClient.duplicate();
subClient.on('connect', () => console.log('Connected to REDIS!'));
subClient.on('error', (err) => console.log('Error connecting to REDIS: ', err));

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient, { key }));
    io.listen(portTwo);
});

io.on('connect', (socket) => {
    socket.join('hello');
    console.log(`connected ${socket.id}`);
});

io.on('disconnect', (socket) => {
    console.log(`disconected ${socket.id}`);
});

let x = 0;

setInterval(() => {
    io.to('test').emit('testing', {
        number: x++,
    });
}, 3500);
