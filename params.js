/**
 * @file params.js
 */

var params = {'-': {}, '--': {}};

function append(obj, value) {
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

var param = 2;
if (process.argv.length > 2) {
    for (; param < process.argv.length; ++param) {
        var paramStr = process.argv[param];
    	var o = paramStr.charAt(0);
    	if (o === '-' && paramStr.length > 2) {
    		var c = paramStr.charAt(1);
            var nextParam = (param + 1);
            var nextValue;
            if (nextParam < process.argv.length && process.argv[nextParam].charAt(0) !== '-')
                nextValue = process.argv[nextParam];
            else
                continue;

            var pos = 1;
            if (c == '-')
                pos = 2;
            var key = paramStr.substr(pos);
            if (pos === 2) {
                params['--'][key] = append(params['--'][key], paramStr);
            }
            else {
                params['-'][key] = append(params['-'][key], paramStr);
            }
        }
        else {
                params.others = append(params.others, paramStr);
        }
    }
}

module.exports = params;