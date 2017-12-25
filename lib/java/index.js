const util = require('util');

var type = require('./type'),
    Json = require('./json');

function Java() {

};

 /**
  * 
  */

 Java.prototype.fromJsonToClass = function (jsonString, opts, output) {
    var json = new Json();
    json.toJavaClass(jsonString, opts, output);
 }

 /**
  * 
  */

  Java.prototype.jsonToType = function (jsonString, opts, output) {
    if (!output)
        output = console;

    var obj = JSON.parse(jsonString);
    var target = {}

    for (var key in obj) {
        target[key] = type.toType(obj[key]);
    }

    return target;
  }

 Java.java = new Java();

module.exports = Java;