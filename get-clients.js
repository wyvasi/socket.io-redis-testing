
const {Server} = require("socket.io");
const {createAdapter} = require("@socket.io/redis-adapter");
const { Emitter } = require("@socket.io/redis-emitter");
const {createClient} = require("redis");
const {redisUrl, key, portOne} = require('./config');
const io = new Server();

const pubClient = createClient({ url: redisUrl });
pubClient.on('connect', () => console.log('Connected to REDIS!'));
pubClient.on('error', (err) => console.log('Error connecting to REDIS: ', err));

const subClient = pubClient.duplicate();
subClient.on('connect', () => console.log('Connected to REDIS!'));
subClient.on('error', (err) => console.log('Error connecting to REDIS: ', err));

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient, { key }));
    io.listen(portOne);

    const emitter = new Emitter(pubClient, { key });

    setInterval(() => {
        emitter.emit("emitter", (new Date).valueOf());
    }, 2500);
});

setInterval(async () => {
    const sockets = await io.in("hello").fetchSockets();
    console.log(`List with sockets connected to hello: ${sockets.length}`);
    sockets.forEach(socket => {
        console.log(socket.id);
        // io.in(socket.id).socketsLeave('hello');
    });
}, 3500);
