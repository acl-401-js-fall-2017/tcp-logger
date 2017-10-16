const fs = require('fs');

module.exports = function msgParser(logFile, callback) {
    fs.readFile(logFile, 'utf8', (err, data) => {
        let msgObj = data.split('\n');
        msgObj = msgObj.map( x => {
            let secondSplit = x.split(' ** ');
            let y = {date: secondSplit[0], message: secondSplit[1]};
            return y;
        });
        callback(null, data);
    });
};