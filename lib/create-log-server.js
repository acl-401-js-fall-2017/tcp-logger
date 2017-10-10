'use strict';

const net = require('net');
const fs = require('fs');

module.exports = function(logfile) {
    
    const app = net.createServer(client => {
        client.setEncoding('utf8');
        client.on('data', message => {
            const logStream = fs.createWriteStream(logfile, {'flags': 'a'});
            message.pipe(logStream);
        });
    });

    return app;
};