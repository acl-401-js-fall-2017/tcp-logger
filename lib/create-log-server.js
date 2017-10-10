const fs = require('fs');
const net = require('net');

function createLogServer(logFile){
    const stream = fs.createWriteStream(`${logFile}`, {'flags': 'a'});
    const server = net.createServer((client)=>{
        client.setEncoding('utf8');
        client.on('data', (massage) =>{
            const parsedMessage = `${Date()}  **  ${massage}\n`; 
            stream.write(parsedMessage); 
        });
    });
    return server;
}
module.exports = createLogServer;