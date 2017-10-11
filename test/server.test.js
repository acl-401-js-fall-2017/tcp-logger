const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
const net = require('net');
const fs = require('fs');
const path = require('path');




describe('chat app server', () => {
    const port = 15688;
    const logFile = path.join(__dirname, 'log.txt');

    beforeEach(done => {
        fs.unlink(logFile, err => {
            if(err && err.code !== 'ENOENT') done(err);
            done();
        });
    });
    
    let clients = null;
    let server = null;
    beforeEach(done => {
        clients = [];
        server = createLogServer(logFile);
        server.listen(port, done);
    });
    
    afterEach(() => {
        clients.forEach(client => client.destroy());
        server.close();
    });

    function openClient(callback) {
        let client = net.connect(port, () => {
            client.setEncoding('utf8');
            clients.push(client);
            callback(null, client);
        });
    }

    it('runs a test', done => {
        openClient((err, client1) => {
            openClient((err, client2) => {
                assert.equal(clients.length, 2);
                client1.write('client 1 hello world',()=>{
                    client2.write('client 2 hello world', () => {
                        setTimeout(() =>{
                            fs.readFile(logFile,'utf8', (err, readFile)=>{
                                let readArray = readFile.split('\n');
                                readArray = readArray.map(line => {
                                    return {
                                        messege: line.split('  **  ')[1],
                                        date: new Date(line.split('  **  ')[0])
                                    };
                                });
                                console.log('readAarray',readArray);
                                assert.deepEqual(isNaN(readArray[0].date.getTime()),false);
                                assert.deepEqual(isNaN(readArray[1].date.getTime()),false);
                                assert.equal(readArray[0].messege,'client 1 hello world');
                                assert.equal(readArray[1].messege,'client 2 hello world');
                                done();
                            });
                        },1000);
                    });
                });
            });
        });
    });


});
