
const fs = require('fs');
const path = require('path');

function Config() {

}

Config.prototype.load = function (path, encoding, defaultConfig) {
    if (typeof encoding === 'object' && !defaultConfig) {
        defaultConfig = encoding;
        encoding = 'utf8';
    }

    encoding = encoding || "utf8";

    const localConfigFile = path;
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
    
    return configJson;
}

module.exports = new Config();
