
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
    localConfigFile = localConfigFile || this.configFile || "config.local.json";

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

    this.config = configJson || defaultConfig || {};

    if (this.applyDebug && typeof this.config.debug === 'undefined')
        this.config.debug = process.env.NODE_ENV === 'development';
    
    return this.config;
}

Config.prototype.write = async function (configFileToSave, config) {
    var configFile = configFileToSave || this.configFile || "config.local.json";
    config = config || this.config;
    if (config) {
        try {
            fs.writeFileSync(configFile, JSON.stringify(this.config));
            console.log("Config file saved");
        }
        catch (err) {
            console.error("Error in saving the config file");
        }
    }
}


module.exports = Config;
