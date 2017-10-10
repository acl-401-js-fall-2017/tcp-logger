const fs = require('fs');
module.exports = function msgParser(logFile, callback) {
    fs.readFile(logFile, 'utf8', (err, data) => {
        // eslint-disable-next-line
        console.log(data);
        callback(null, data);
    });
};