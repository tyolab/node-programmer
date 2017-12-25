const util = require('util'),
    datatype = require('tyo-utils').dataype;

var Type = require('./type'),
    Json = require('./json');

function Java(opts) {
    this.opts = opts;
    this.type = new Type();
};

 /**
  * 
  */

 Java.prototype.fromJsonToClass = function (jsonString, output) {
    var json = new Json();
    json.toJavaClass(jsonString, this.opts, output);
 }

 /**
  * 
  */

  Java.prototype.jsonToType = function (jsonString, output) {
    if (!output)
        output = console;

    var obj;
    if (datatype.isString(jsonString))
        obj = JSON.parse(jsonString);
    else
        obj = jsonString;

    var target = {};

    for (var key in obj) {
        var value = obj[key];
        if (value && datatype.isObject(value)) {
            if (Array.isArray(value)) {
                if (value.length > 0 && datatype.isObject(value[0]))
                    target[key] = this.jsonToType(value[0]);
                else
                    target[key] = this.type.toType(obj[key]);
            }
            else    
                target[key] = this.jsonToType(value);
        }
        else
            target[key] = this.type.toType(obj[key]);
    }

    return target;
  }

 Java.java = new Java();

module.exports = Java;