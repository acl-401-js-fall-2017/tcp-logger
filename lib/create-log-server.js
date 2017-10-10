'use strict';

const net = require('net');
const fs = require('fs');

module.exports = function(logfile) {
    
    const app = net.createServer(client => {
        client.setEncoding('utf8');

        const logStream = fs.createWriteStream(logfile, {'flags': 'a'});

        logStream.write(`${new Date} ** new client connected\n`);

        client.on('data', message => {
            const timeStamp = new Date();
            logStream.write(`${timeStamp} ** ${message}\n`);
        });
    });

    return app;
};