'use strict';

const fs = require('fs');

module.exports = function(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, dataString) => {
        if(err) return err;
        const lines = dataString.split('\n');
        const logData = lines.map(line => {
            const newLineObj = {
                time: line.split(' ** ')[0],
                message: line.split(' ** ')[1]
            };
            return newLineObj;
        });
        logData.pop();
        callback(logData);
    });
};