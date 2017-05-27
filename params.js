/**
 * @file params.js
 */

const datatype = require('tyo-utils').dataype;

function Params(defaults) {
}

/**
 * 
 */

Params.prototype.append = function (obj, value) {
    var ret;
    if (!obj)
        ret = value;
    else {
        if (Array.isArray(obj))
            (ret = obj).push(value);
        else
            ret = [obj, value];
    }
    return ret;
}

/**
 * 
 */

Params.prototype.getOpts = function () {
    var params = {'-': {}, '--': {}, inputs: null};
    var param = 2;
    if (process.argv.length > 2) {
        for (; param < process.argv.length; ++param) {
            var paramStr = process.argv[param];
            var o = paramStr.charAt(0);
            if (o === '-' && paramStr.length > 2) {
                var c = paramStr.charAt(1);
                var nextParam = (param + 1);
                var nextValue = null;
                /**
                 * 1) 
                 * if inputs.length > 0
                 * 
                 * the next value should be paramter value
                 * 
                 * 2) 
                 */
                if (nextParam < process.argv.length && process.argv[nextParam].charAt(0) !== '-' && nextParam != (process.argv.length - 1)) {
                    nextValue = process.argv[nextParam];
                }

                if (nextValue === null)
                    nextValue = true;

                var pos = 1;
                if (c == '-')
                    pos = 2;
                var key = paramStr.substr(pos);
                if (pos === 2) {
                    params['--'][key] = this.append(params['--'][key], nextValue);
                }
                else {
                    params['-'][key] = this.append(params['-'][key], nextValue);
                }
            }
            else {
                    params.inputs = this.append(params.others, paramStr);
            }
        }
    }

    return params;
}

/**
 * 
 */

Params.prototype.newInstance = function (defaults) {
    return new Params(defaults);
}

var paramsInstance = paramsInstance || new Params();

module.exports = paramsInstance;