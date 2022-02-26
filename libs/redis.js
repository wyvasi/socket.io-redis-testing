const Redis = require('redis');

const retry_strategy = (options) => {
    if (options.attempt === 1 && options.error && options.error.code === 'ECONNREFUSED') {
        console.log('The redis server refused the connection');
    }
    if ((options.attempt % 10) === 0) {
        console.log(`Retry time exhausted ${options.total_retry_time}`);
    }
    return 1000; // reconnect after
};

const onRedisError = (err) => {
    console.error(err);
};

const onRedisConnect = () => {
    console.log('Redis connected');
};

const getClient = async (url) => {
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
    getClient,
};
