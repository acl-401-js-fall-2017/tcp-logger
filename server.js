const net = require('net');

const server = net.createServer(client => {
    client.setEncoding('utf8');

    client.write('welcome to my tcp server\n');

    client.pipe(process.stdout);
});

server.listen(15678, () => console.log('tcp server started'));

module.exports = server;