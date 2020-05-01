
const fs = require('fs');
const path = require('path');

function Config(applyDebug) {
    this.applyDebug = applyDebug || false;
}

Config.prototype.load = function (localConfigFile, encoding, defaultConfig) {
    if (typeof encoding === 'object' && !defaultConfig) {
        defaultConfig = encoding;
        encoding = 'utf8';
    }

    encoding = encoding || "utf8";
    localConfigFile = localConfigFile || "config.local.json";

    var configJson = null;
    if (fs.existsSync(localConfigFile)) {
        const jsonFile = fs.readFileSync(localConfigFile, encoding);

        try {
            configJson = JSON.parse(jsonFile);
        }
        catch (err) {
            console.error(err);
        }
    }

    if (!configJson)
        configJson = defaultConfig || {};

    if (this.applyDebug)
        configJson.debug = configJson.debug || process.env.NODE_ENV === 'development';
    
    return configJson;
}

module.exports = Config;
