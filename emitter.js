const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const { Emitter } = require('@socket.io/redis-emitter');
const { getClient } = require('./libs/redis');
const { redisUrl, key, portOne } = require('./config');


let emitter = null;

getClient(redisUrl)
    .then((pubClient) => {
        emitter = new Emitter(pubClient, { key });

        // setInterval(() => {
        //     emitter.to('hello').emit('emitter', (new Date).valueOf());
        // }, 2500);
    });

const rl = readline.createInterface({ input, output });

console.log(`
    Welcome, here are you can use next commands:
    emit room message
`);

rl.on('line', (input) => {
    const messages = (input || '').split(' ');
    if (messages[0]) {
        const room = messages[1];
        const message = messages[2] || 'default message';
        emitter.to(room).emit('emitter', message);
        console.log(`Sent data to all sockets in room ${room}`);
    }
    return true;
});