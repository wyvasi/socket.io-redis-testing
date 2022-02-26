const { createServer } = require("http");
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { instrument } = require("@socket.io/admin-ui");
const { getClient } = require('./redis');
const { redisUrl, key } = require('../config');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(io, {
    auth: false
});

let initialized = false;

const init = (port) =>
    new Promise((resolve) => {
        if (initialized) return resolve();
        Promise.all([getClient(redisUrl), getClient(redisUrl)])
            .then(([pubClient, subClient]) => {
                io.adapter(createAdapter(pubClient, subClient, { key }));
                httpServer.listen(port);
                initialized = true;
                resolve();
            });
    });

const getServer = async (port) => {
    await init(port);
    return io;
};

async (url) => {
    const client = Redis.createClient({
        url,
        retry_strategy,
    });
    client.on('error', onRedisError);
    client.on('connect', onRedisConnect);
    await client.connect();
    return client;
};

module.exports = {
    getServer,
};
