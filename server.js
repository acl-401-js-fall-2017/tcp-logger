const createLogServer = require('./lib/create-chat');

const server = createLogServer();
server.listen(15678, () => {
    // eslint-disable-next-line
    console.log('chat server running');
});