const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const { Emitter } = require('@socket.io/redis-emitter');
const { getClient } = require('./libs/redis');
const { redisUrl, key, portOne } = require('./config');


let emitter = null;

getClient(redisUrl)
    .then((pubClient) => {
        emitter = new Emitter(pubClient, { key });
    });

const rl = readline.createInterface({ input, output });

console.log(`
    Welcome, here are you can use next commands:
    emit $room $message
    clients add $number
    clients remove $number
`);

rl.on('line', (input) => {
    const [type, room, message] = (input || '').split(' ');
    if (type === 'emit') {
        emitter.to(room).emit('emitter', message || 'default message');
        console.log(`Sent data to all sockets in room ${room}`);
    }
    else if (type === 'clients') {
        emitter.emit('clients' , {
            type: room,
            number: parseInt(message)
        });
    }
    // emitter.serverSideEmit()
    return true;
});