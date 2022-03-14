const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const Params = require('../params');

describe('params', () => {
    it('params', async function() {
        var params = new Params({
            "long": "long",
            "port": "8080", 
            "host": "localhost",
            "static": "./static",
            "views": {default: "./views", short: "i"},
            "forward": false
        });

        var opts = params.getOpts([/* "node" *//**ignored *//* , "test.js" *//**ignored*/, "-p", "8080", "-h", "127.0.0.1", "input1", "input2", "-i", "./views2", "-f"]);

        /**
         * Opitons (Parameters / Arguments) count equals to the number of specified arguments, not the total count of all parameters
         * And the empty parameters will be ignored, and not included in the option count
         */
        var optCount = params.getOptCount();
        expect(optCount).to.equal(6);

        expect(opts.long).to.equal("long");
        expect(opts.port).to.equal("8080");
        expect(opts.host).to.equal("127.0.0.1");
        expect(opts.static).to.equal("./static");
        expect(opts.views).to.equal("./views2");
        expect(opts.forward).to.equal(true);

        var inputs = opts['---'];

        expect(inputs.length).to.equal(2);
        expect(inputs[0]).to.equal("input1");
        expect(inputs[1]).to.equal("input2");
        
    });
});