/**
 * @file java.js
 * 
 * Take json as input and convert the keys into fields
 */

fs = require('fs')
log = console; // require('./log');
var jsonFile = process.argv[2];
var jsonString = fs.readFileSync(jsonFile, 'utf8').trim();

// for being lazy, if the input is not started / ended with barackets {} , [], it will be treated as an object
var firstC, lastC;
fristC = jsonString[0];
lastC = jsonString[jsonString.length - 1];
jsonString = ((firstC !== '{' && firstC !== '[') ? '{' : '')
            + jsonString
            ((lastC !== '}' && lastC !== ']') ? '}' : '');

var jsonObj;
try {
    jsonObj = JSON.parse(jsonString);

    for (var key in jsonObj)
        console.log('public ')
}
catch (e) {
    jsonObj = {};
    log.error('Parsing json file error', e);
    process.exit(-1);
}

