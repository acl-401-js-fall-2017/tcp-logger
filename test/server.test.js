const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
// const createLogServer = require('../server');
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

    it('test if the file exists and has messages from both clients', done => {
        openClient((err, client1) => {
            openClient((err, client2) => {
                // do client.write calls
                client1.write('hello world!');
                 // read log file and test
                client2.write('HELLO WORLD!', () => {
                    setTimeout(() =>{
                        fs.readFile(logFile, 'utf8', (err,loggedData) => {
                            if(err) return done(err);
                        });
                        done();
                    });
                }); 
            });
        });
    });
    
    it('checks log formatting',done => {
        openClient((err, client1) => {
            openClient((err, client2) => {
                // do client.write calls
                client1.write('hello world!');
                 // read log file and test
                client2.write('HELLO WORLD!', () => {
                    setTimeout(() =>{
                        fs.readFile(logFile, 'utf8', (err,loggedData) => {
                            if(err) return done(err);
                            let msg = loggedData.split('\n');
                            let splitMsg = msg[0].split('**')
                            assert.deepEqual(isNaN(splitMsg[0]), true);
                            assert.deepEqual(splitMsg[1], ' hello world!');
                            
                            done();
                        });
                    });
                }); 
            });
        });
    });
});
