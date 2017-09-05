/**
 * @file java.js
 * 
 * Take json as input and convert the keys into fields
 */

var fs = require('fs'),
    util = require('util');

var log = console; // require('./log');
var Params = require('./params');
var optsAvailable = {
    'key-before-all': false, 
    prefix: {desc: '"a-prefix-string"', default: "public ", short: 'p', input: null}, 
    suffix: {desc: '"a-suffix-string"', default: ";", short: 's', input: null}, 
    "to-java-type": null, 
    "text-before-key": {desc: '"the text before the key"' , default: "", input: null},
    camelcase: true, 
    class: false, 
    serialize: false,
    "key-to-all-caps": false,
    format: {desc: "the-format-of-output", default: null, input: null}
};

var params = new Params(optsAvailable);

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var opts = params.getOpts();
var optCount = params.getOptCount();

if (optCount === 0) {
    params.setUsage(optsAvailable);
    params.showUsage();
    process.exit(-1);
}

var longOpts = opts;
var inputs = opts['---'];

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
    var prefix = longOpts.prefix; // || shortOpts.p || optsAvailable.prefix.default;
    var suffix = longOpts.suffix; // || shortOpts.s || optsAvailable.suffix.default;
    var textBeforeText = longOpts["text-before-key"] || optsAvailable["text-before-key"].default;
    for (var key in jsonObj) {
        var value = jsonObj[key];

        var targetKey = key;
        if (!!longOpts["key-to-all-caps"])
            targetKey = key.toUpperCase();

        var type = "";
        var fieldOut = "";
        if (!!longOpts["to-java-type"]) {
            type = javatype.toJavaTypeString(value, {serialize: !!longOpts.serialize});
            
            if (!!longOpts.camelcase) {
                type = type.charAt(0).toUpperCase() + type.substr(1);
            }

            if (datatype.isString(longOpts["to-java-type"]))
                type += longOpts["to-java-type"];
            else
                type += ' ';
        }
        else {
            //
        }

        if (longOpts.format === null && longOpts.format.length > 0) {
            if (longOpts['key-before-all'])
                fieldOut = textBeforeText + targetKey + prefix + type + suffix;
            else
                fieldOut = prefix + type + textBeforeText + targetKey + suffix;
        }
        else {
            var replaceKey = longOpts.format.replaceAll("\\$key", key);
            if (replaceKey !== null)
                replaceKey = replaceKey.replaceAll("\\$KEY", targetKey);

            if (replaceKey !== null)
                fieldOut = replaceKey.replaceAll("\\$type", type);
        }

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

