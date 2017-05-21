/**
 * @file type.js
 */

var datatype = require('tyo-utils').dataype;

function Type () {

}

/**
 * To Java Type
 */
Type.prototype.toJavaTypeString = function (value) {
    var typeStr;
    if (datatype.isBoolean(value))
        typeStr = "boolean";
    else if (datatype.isString(value))
        typeStr = "String";
    else if (datatype.isNumber2(value)) {
        if (value > -2147483648 && value < 2147483647)
            typeStr = "int";
        else
            typeStr = "long";
    }
    else if (datatype.isFunction(value))
        typeStr = "void";
    else if (Array.isArray(value))
        typeStr = "List";
    return typeStr;
}

module.exports = new Type();