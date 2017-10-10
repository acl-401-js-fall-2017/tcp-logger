const net = require('net');


module.exports = function createLogServer (logFile) {
    const server = net.createServer(client => {
        client.on('data', message => {

        });
    });
    return server;
}
