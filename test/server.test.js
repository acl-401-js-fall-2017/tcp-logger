const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
const net = require('net');
const fs = require('fs');
const path = require('path');
const testSupport = require('../lib/test-support');

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
            client1.write('Client One');
            openClient((err, client2) => {
                client2.write('Client Two', () => {
                    setTimeout( () => {
                        fs.readFile(logFile, 'utf8', (err, data) => {
                            testSupport(logFile, (err, data2) => {
                                assert.deepEqual(data, data2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});
