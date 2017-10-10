const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
const net = require('net');
const fs = require('fs');
const path = require('path');
const parseLog = require('../lib/parse-log');

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
            client1.write('this is a message', () => {
                openClient((err, client2) => {
                    // do client.write calls
                    // on last client.write call, you need to use the
                    // write callback to *wait" for the socket to finish before you test the log file
                    client1.write('second message from cli1');
                    
                    client2.write('some message', () => {
                        // read log file and test here!
                        setTimeout(() => {
                            let logMessages = [];
                            let logDates = [];
                            parseLog(logFile, logData => {

                                logMessages = logData.map(lineObj => lineObj.message);
                                logDates = logData.map(lineObj => lineObj.time);
                                
                                assert.deepEqual(
                                    logMessages,
                                    [
                                        'new client connected',
                                        'this is a message',
                                        'new client connected',
                                        'second message from cli1',
                                        'some message'
                                    ]
                                );

                                logDates.forEach(date => {
                                    assert.ok(!isNaN(new Date(date).getTime()));
                                });

                                done();
                            });
                        }, 500);
                    });
                    
                });

            });
        });
    });


});
