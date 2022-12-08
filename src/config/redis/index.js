
/*const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
    
});

client.connect()

client.on('error', err => {
    console.log('Error ' + err);
});

client.on("connect", function(err){
    console.log('redis connected')
})

client.on("ready", function(err){
    console.log('Redis to ready')
})

module.exports = client*/

const Redis = require('ioredis');
const fs = require('fs');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


module.exports = redis