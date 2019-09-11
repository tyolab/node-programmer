/**
 * @file params.js
 */

const datatype = require('tyo-utils').;

function Params(defaults) {
    defaults = defaults || {};

    this.optCount = -1;
    /**
     * Parsed User Parameters
     */
    this.params = {};
    
    this['-'] = {};

    // { name: {desc: "", default: value, sample: value}}
    /**
     * Available Options
     */
    this.setUsage(defaults);
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
    return this.parse();
}

/**
 * 
 */

Params.prototype.parse = function () {
    if (this.optCount > -1)
        return this.params;

    this.optCount = 0;

    var params = this.params;
    var param = 2;
    if (process.argv.length > 2) {
        for (; param < process.argv.length; ++param) {
            this.optCount += 1;

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

                    if (nextValue === 'true') 
                        nextValue = true;
                    else if (nextValue === 'false')
                        nextValue = false;

                    param = nextParam;
                }

                if (nextValue === null)
                    nextValue = true;
        
                var pos = 1;
                if (c == '-')
                    pos = 2;
                var key = paramStr.substr(pos);
                var longKey;
                if (pos === 2) {
                    longKey = key;
                }
                else {
                    var longKey = this['-'][key];
                    if (!longKey)
                        longKey = key;
                }
                if (!(longKey in params)) {
                    console.error('Unknown option "' + longKey + '", please check your input and try it again');
                    process.exit(-1);
                }
                /**
                 * @todo data type check
                 */
                params[key] = this.append(params[key], nextValue);
            }
            else {
                params['---'] = this.append(params['---'], paramStr);
            }
        }
    }

    return this.params;
}

/**
 * Get Input Argument Count
 */

Params.prototype.getOptCount = function () {
    if (this.optCount == -1)
        this.getOpts();

    return this.optCount;
}

/**
 * 
 */

Params.newInstance = function (defaults) {
    return new Params(defaults);
}

/**
 * 
 */

Params.prototype.setUsage = function (opts) {
    this.opts = opts;

    this.parseUsage();
}

/**
 * 
 */

Params.prototype.parseUsage = function () {
    if (!this.opts)
        return;

    for (var key in this.opts) {
        var obj = this.opts[key];

        if (obj) {
            this.params[key] = obj.default;
            if (obj.short) {
                this['-'][obj.short] = key;
            }
        }
        else
            this.params[key] = null;
    }
}

/**
 * Return Usage
 */

Params.prototype.showUsage = function (filename) {
    filename = filename || ".";

    var msg = "node " + filename;
    var optStr = "";
    for (var key in this.opts) {
        optStr = optStr + " ";

        var switchStr;
        if (key.length === 1)
            switchStr = "-" + key;
        else
            switchStr = "--" + key;
        
        optStr += switchStr;

        var objValue = this.opts[key];
        var value = null;
        if (objValue !== null) {
            if ((typeof objValue) === 'object') {
                objValue.switch = switchStr;
                if (objValue.sample !== null)
                    value = objValue.sample;
            }
            else {
                value = objValue;
                var obj = {switch: switchStr, default: objValue};
                this.opts[key] = obj;
            }
        }

        if (value !== null)
            optStr = optStr + ' ' + (datatype.isBoolean(value) ? 'true|false' : value);
    }
    console.error('Usage:');
    console.error('\t' + msg + optStr);
    console.error();
    for (var key in this.opts) {
        var objValue = this.opts[key];
        if (objValue && objValue.desc) {
            console.error('\t\t' + objValue.switch + '\t\t' + objValue.desc);
            console.error('\t\t\t\t' + '\t' + 'default: "' + objValue.default + '"');
            console.error();
        }
    }
}

module.exports = Params;