const { getServer } = require('./libs/server');
const { portTwo } = require('./config');

let io;

(async() => {
    io = await getServer(portTwo);

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
})();


let x = 0;
setInterval(() => {
    io.to('test').emit('testing', {
        number: x++,
    });
}, 3500);
