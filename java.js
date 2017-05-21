/**
 * @file java.js
 * 
 * Take json as input and convert the keys into fields
 */

var fs = require('fs'),
    util = require('util');

var log = console; // require('./log');
var params = require('./params');
var jsonFile = process.argv[2];
var jsonString = fs.readFileSync(jsonFile, 'utf8').trim();
var datatype = require('tyo-utils').dataype;
var javatype = require('./lib/java/type');

// for being lazy, if the input is not started / ended with barackets {} , [], it will be treated as an object
var firstC, lastC;
firstC = jsonString.charAt(0);
lastC = jsonString[jsonString.length - 1];
jsonString = ((firstC !== '{' && firstC !== '[') ? '{' : '') + jsonString + ((lastC !== '}' && lastC !== ']') ? '}' : '');

var longOpts = params['--'];
var shortOpts = params['-'];

var jsonTemplate = "%";
if (longOpts.class)
    jsonTemplate = "public class " + longOpts.class + `{
        %s
        }`;

var jsonObj;
try {
    jsonObj = JSON.parse(jsonString);
    var fieldsOut = "";
    for (var key in jsonObj) {
        var value = jsonObj[key];
        var type = javatype.toJavaTypeString(value);
        var fieldOut = 'public ' + type + ' ' + key + ';';
        fieldsOut += fieldOut + '\n';
    }
    console.log(fieldsOut);
}
catch (e) {
    jsonObj = {};
    log.error('Parsing json file error');
    log.error(e);
    process.exit(-1);
}

