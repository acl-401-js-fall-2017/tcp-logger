const fs = require('fs');
module.exports = function msgParser(logFile, callback) {
    fs.readFile(logFile, 'utf8', (err, data) => {
        let msgObject = data.split('\n');

        msgObject = msgObject.map( x => {
            let msgObjSplit = x.split(' ** ');
            let y = {date: msgObjSplit[0], message: msgObjSplit[1]};
            return y;
        });
        // eslint-disable-next-line
        console.log(msgObject);
        callback(null, data);
    });
};