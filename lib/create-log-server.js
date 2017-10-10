const net = require('net');
const fs = require('fs');
const path = require('path');

function formatLog(message) {
    return `${ new Date()} ** ${ message }`+ '\n';

}


module.exports = function createLogServer (logFile) {
    const server = net.createServer(client => {
        client.on('data', message => {
            fs.appendFile(logFile, formatLog(message), err =>{
                if(err) return done(err);
            });
        });
    });
    return server;
};