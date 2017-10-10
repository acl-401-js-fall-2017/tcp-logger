const fs = require('fs');

module.exports = function msgParser(logFile, callback) {
    fs.readFile(logFile, 'utf8', (err, data) => {
        let msgObj = data.split('\n');
        msgObj = msgObj.map( x => {
            let msgArr = x.split(' ** ');
            let y = { date: msgArr[0], message: msgArr[1] };
            return y;
        });
        console.log('******' + msgObj);
        callback(null, data);
    });
};