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
    //
    'from-json-to-class': true,

    // 
    'json-to-type': false
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
var datatype = require('tyo-utils').;
var java = require('./lib/java').java;

java.opts = longOpts;

if (longOpts['from-json-to-class']) {

}
else if (longOpts['json-to-type']) {
    var target = java.jsonToType(jsonString);

    console.log(JSON.stringify(target));
}

