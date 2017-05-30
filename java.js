/**
 * @file java.js
 * 
 * Take json as input and convert the keys into fields
 */

var fs = require('fs'),
    util = require('util');

var log = console; // require('./log');
var params = require('./params');

var opts = params.getOpts();

var longOpts = opts['--'];
var shortOpts = opts['-'];
var inputs = opts.inputs;

var jsonFile = Array.isArray(inputs) ? inputs[0] : inputs;
var jsonString = fs.readFileSync(jsonFile, 'utf8').trim();
var datatype = require('tyo-utils').dataype;
var javatype = require('./lib/java/type');

// for being lazy, if the input is not started / ended with barackets {} , [], it will be treated as an object
var firstC, lastC;
firstC = jsonString.charAt(0);
lastC = jsonString[jsonString.length - 1];
jsonString = ((firstC !== '{' && firstC !== '[') ? '{' : '') + jsonString + ((lastC !== '}' && lastC !== ']') ? '}' : '');

var jsonTemplate = "%";
if (longOpts.class)
    jsonTemplate = "public class " + longOpts.class + `{
        %s
        }`;

var jsonObj;
try {
    jsonObj = JSON.parse(jsonString);
    var fieldsOut = "";
    var prefix = longOpts.prefix || shortOpts.p || "";
    var suffix = longOpts.suffix || shortOpts.toJavaTypeString || "";
    for (var key in jsonObj) {
        var value = jsonObj[key];
        var type = "";
        var fieldOut = "";
        if (!!longOpts.type) {
            type = javatype.toJavaTypeString(value, {serialize: !!longOpts.serialize});
            
            if (!!longOpts.camelcase) {
                type = type.charAt(0).toUpperCase() + type.substr(1);
            }

            if (datatype.isString(longOpts.type))
                type += longOpts.type;
            else
                type += ' ';
        }
        else {
            //
        }
        if (longOpts['key-before-all'])
            fieldOut = key + prefix + type + suffix;
        else
            fieldOut = prefix + type + key + suffix;

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

