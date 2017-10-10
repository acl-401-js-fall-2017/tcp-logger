const net = require('net');
const fs = require('fs');
//const parser = require('../lib/parsergit ');


module.exports = function createLogServer (logfile){
   
    const app = net.createServer(client =>{
        client.setEncoding('utf8');
        client.on('data', message =>{
            const stream = fs.createWriteStream(logfile, {'flags': 'a'});
            stream.write(message);
        });
    });
    return app;
};