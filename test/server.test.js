const assert = require('assert');
const createLogServer = require('../lib/create-log-server');
const parseLog = require('../lib/parse-log');
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


    it('test if file exists for both clients', done => {
        openClient((err, client1) => {
            openClient((err, client2) => {
                // do client.write calls
                client1.write('client Ones message here');
                 // read log file and test
                client2.write('client Twos message here', () => {
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
                client1.write('client Ones message here');
                 // read log file and test
                client2.write('client Twos message here', () => {
                    setTimeout(() =>{
                        fs.readFile(logFile, 'utf8', (err,loggedData) => {
                            if(err) return done(err);
                            let msg = loggedData.split('\n');
                            let splitMsg = msg[0].split('**')
                            assert.deepEqual(isNaN(splitMsg[0]), true);
                            assert.deepEqual(splitMsg[1], ' client Ones message here ');
                            
                            done();
                        });
                    });
                }); 
            });
        });
    });
});
describe.skip('it is a funny test that doesnt like to skip', () => {


    it('runs a test', done => {
        openClient((err, client1) => {
            
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
                        fs.readFile(logFile, 'utf8', (err, data)  => {

                                // test for correct messages
                                const splitData = data.split('\n');
                                
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

                                // test for valid dates
                                logDates = logData.map(lineObj => lineObj.time);
                                
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



