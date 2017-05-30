/**
 * @file type.js
 */

var datatype = require('tyo-utils').dataype;

function Type () {

}

/**
 * To Java Type
 */
Type.prototype.toJavaTypeString = function (value, opts) {
    opts = opts || {};
    var typeStr = "Object";
    if (datatype.isBoolean(value))
        typeStr = "boolean";
    else if (datatype.isString(value)) {
        if (!!opts.serialize)
            typeStr = "Object";
        else
            typeStr = "String";
    }
    else if (datatype.isNumber2(value)) {
        if (value > -2147483648 && value < 2147483647)
            typeStr = "int";
        else
            typeStr = "long";
    }
    else if (datatype.isFunction(value))
        typeStr = "void";
    else if (Array.isArray(value)) {
        if (!!opts.serialize)
            typeStr = "Object";
        else
            typeStr = "List";
    }

    return typeStr;
}

module.exports = new Type();