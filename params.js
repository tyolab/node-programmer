/**
 * @file params.js
 */

const path = require('path');

const datatype = require('tyo-utils').datatype;

function logError(message) {
    console.error(message);
    process.exit(-1);
}

/**
 *
 * @param {*} defaults
 * @param {*} enforceEmptyOption true/false, to check if the option exists in the default option, if not an exception will be thrown
 */

function Params(defaults, enforceEmptyOption) {
    this.defaults = defaults || {};
    this.enforceEmptyOption = (typeof enforceEmptyOption === 'undefined' || typeof enforceEmptyOption !== 'boolean') ? true : enforceEmptyOption;

    this.optCount = -1;
    /**
     * Parsed User Parameters
     */
    this.params = {};
    this.argv = null;
    this.logger = null;

    this['-'] = {};

    // { name: {desc: "", default: value, sample: value}}
    /**
     * Available Options
     */
    this.setUsage(this.defaults);
}

/**
 * @param {*} object
 * @param {*} object
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

Params.prototype.getOpts = function (argv) {
    this.argv = argv;

    return this.parse();
}

/**
 *
 */

Params.prototype.parse = function () {

    if (this.optCount > -1)
        return this.params;

    this.optCount = 0;
    if (!this.argv) {
        this.argv = process.argv.map((x) => x);
        this.argv.shift(); // the node itself
        this.argv.shift(); // the node script / program
    }

    var params = this.params;
    var param = 0;
    for (; param < this.argv.length; ++param) {
        var paramStr = this.argv[param];
        if (!paramStr) {
            if (this.logger && this.logger.warn)
                this.logger.warn("Empty parameter in positon " + param);
            continue;
        }

        this.optCount += 1;
        var o = paramStr.charAt(0);
        if (o === '-') {
            if (paramStr.length > 1) {
                var c = paramStr.charAt(1);
                var isEmptyOption = false;
                /**
                 * Get the long key
                 */
                var pos = 1;
                var longKey = undefined;
                if (c == '-')
                    pos = 2;

                var key = paramStr.substr(pos);
                
                if (pos === 2) {
                    longKey = key;
                } else {
                    longKey = this['-'][key];
                    if (!longKey)
                        longKey = key;
                }
                isEmptyOption = typeof (longKey in this.defaults) === 'undefined';
                if (isEmptyOption && this.enforceEmptyOption) {
                    console.error('Unknown option "' + longKey + '", please check your input and try again');
                    process.exit(-1);
                }

                /**
                 * The option doesn't have to have a value
                 */
                var defaultValue = null;
                var nullable = true;
                if ((typeof this.defaults[longKey]) === 'boolean')
                    defaultValue = true; // this.defaults[key];
                else if (this.defaults[longKey]) {
                    if (!Array.isArray(this.defaults[longKey]) && typeof this.defaults[longKey] === 'object') {
                        // Get the default value
                        defaultValue = (this.defaults[longKey].default) ? this.defaults[longKey].default : null;

                        // Get if it is nullable, if it
                        if (typeof this.defaults[longKey].nullable === 'boolean')
                            nullable = this.defaults[longKey].nullable;
                        else if (typeof this.defaults[longKey].required === undefined || typeof this.defaults[longKey].required === 'boolean') {
                            if (typeof this.defaults[longKey].required === undefined)
                                nullable = false;
                            else
                                nullable = this.defaults[longKey].required;

                            if (this.defaults[longKey].nullable)
                                console.warn("An argument should not be specified as nullable after it is marked as required");
                        }

                        // if nullability is not provideded, we consider it is required 
                        // else {
                        //     // interchangable for nullable or (not) required
                        //     // if not provided, if will be defaulted as not required 
                        //     if (typeof this.defaults[longKey].required != 'undefined')
                        //         this.defaults[longKey].nullable = !this.defaults[longKey].required;
                                
                        //     if (typeof this.defaults[longKey].nullable === 'boolean')
                        //         nullable = (this.defaults[longKey].nullable);
                        //     else
                        //         throw new Error("The nullability of a required key must be specified (boolean type) if the default value does not exist for key: " + longKey + ", for example {nullable: false}");
                        // }
                    } 
                    else
                        defaultValue = this.defaults[longKey];
                }
                params[longKey] = defaultValue;

                /**
                 * Now the value of the option
                 */
                var nextParam = (param + 1);
                var nextValue = null;
                /**
                 * Get the option value
                 *
                 * 1)
                 * if inputs.length > 0
                 *
                 * the next value should be paramter value
                 *
                 * 2) OK,
                 *
                 */
                if (nextParam < this.argv.length) {

                    // if the next param is a value
                    if (this.argv[nextParam].charAt(0) !== '-') {
                        // we can only know what to do is that we know the default value / type of an option
                        if (!isEmptyOption) {
                            nextValue = this.argv[nextParam];

                            if (nextValue === 'true' || nextValue === 'yes')
                                nextValue = true;
                            else if (nextValue === 'false' || nextValue === 'no')
                                nextValue = false;
                            else {
                                // a non boolean value is provided for the option
                                if (typeof this.defaults[longKey] === 'boolean' && typeof params[longKey] !== 'boolean') {
                                    // not supposed to take any value for this option
                                    // if the option exist, the default boolean value is true
                                    logError('A boolean value is needed for option: "' + longKey + '", please check your input and try it again');
                                }
                            }

                            if ((nextValue === true || nextValue == false) &&
                                (params[longKey] !== true && params[longKey] !== false)) {
                                logError("A non boolean value is required for options: " + longKey);
                            }

                            /**
                             * @todo data type check
                             */
                            if (typeof params[longKey] === 'boolean') {
                                if (typeof nextValue === 'boolean') {
                                    params[longKey] = nextValue;
                                    param = nextParam;
                                }
                            }
                            else {
                                if (Array.isArray(this.defaults[longKey]))
                                    params[longKey] = this.append(params[longKey], nextValue);
                                else
                                    params[longKey] = nextValue;
                                param = nextParam;
                            }
                        }
                    }
                    // no value provided
                    else {
                        // if the option (with the key) doesn't not exist in the default option
                        // we won't be able to tell if it should be followed by a value or if it is a switch (true/false)
                        // so we just ignore it
                        if (!nullable || !isEmptyOption) {
                            // if the default value isn't a boolean value
                            if (params[longKey] !== true && params[longKey] !== false) {
                                console.error('A value needs to be provided for option: "' + longKey + '", please check your input and try again');
                                process.exit(-1);
                            }
                            // else
                            // we will set it true as we set in the option
                            else {
                                params[longKey] = true;
                            }
                        }
                    }
                }

            } 
            else
                // in case, there are also needs for output and error
                params['----'] = {
                    input: process.stdin,
                    output: null,
                    error: null
                };
        } 
        else
            params['---'] = this.append(params['---'] || [], paramStr);
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

        // [] could be empty
        // 0 could be a valid value
        // '' could be a valid value
        // false could be a valid value
        if (obj 
            || typeof obj === 'boolean'
            || Array.isArray(obj)
            || typeof obj === 'string'
            || typeof obj === 'number'
            
        ) {
            if (!Array.isArray(obj) && typeof obj === "object") {
                this.params[key] = obj.default;
                if (obj.short) {
                    if (obj.short.length > 1)
                        throw new Error("Short option should be one character only: " + obj.short);
                    this['-'][obj.short] = key;
                    continue;
                }
            } 
            else {
                this.params[key] = obj;
            }

            var first_c = key.charAt(0);

            // if there is no such short option
            if (!this['-'][first_c])
                this['-'][first_c] = key;        
        } 
        else
            this.params[key] = null;
    }
}

/**
 * Return Usage
 */

Params.prototype.showUsage = function (filename) {
    var nodeProgram = process.argv[0] || 'node';
    filename = filename || (__filename);

    var msg = nodeProgram + " " + filename;
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
            if ((typeof objValue) === 'object' && objValue.sample) {
                objValue.switch = switchStr;
                if (objValue.sample !== null)
                    value = objValue.sample;
            } 
            else {
                value = objValue;
                var obj = {
                    switch: switchStr,
                    default: objValue
                };
                this.opts[key] = obj;
            }
        }

        if (value !== null)
            optStr = optStr + ' ' + (datatype.isBoolean(value) ? 'true|false' : value);
    }
    if (this.opts["---"])
        optStr += this.opts["---"];

    console.error('Usage:');
    console.error('\t' + msg + optStr);
    console.error();
    for (var key in this.opts) {
        var objValue = this.opts[key];
        if (objValue && objValue.desc) {
            console.error('\t\t' + objValue.switch+'\t\t' + objValue.desc);
            console.error('\t\t\t\t' + '\t' + 'default: "' + objValue.default+'"');
            console.error();
        }
    }
}

module.exports = Params;
