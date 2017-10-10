const net = require('net');
const fs = require('fs');
// const parser = require('parser');


module.exports = function createLogServer(logFile) {
    
    
    const app = net.createServer(client => {
        client.setEncoding('utf8');
        client.on('data', message => {
            const stream = fs.createWriteStream(logFile, {'flags': 'a'});
            stream.write(`${new Date()}  **  ${message}\n`);
        });
    });
    return app;
};



