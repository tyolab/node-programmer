# node-programmer
I hope it can become A coder/developer's assistant.

## Using Params Library

This library provides an options parsing function.

### Setting all availiable options


### Command Line
node . --long-option-with-value a-value --long-option-without-value-is-enabling -s "short" input1 input2 input3...

## Example Usage

```nodejs
// import the Params class
var Params = require('node-programmer/params');

var params = new Params({
    "long": "long",
    "port": "8080", 
    "host": "localhost",
    "static": "./static",
    "views": {default: "./views", short: "i"},
    "forward": false
});

/**
 * All the necessary arguments are included in the "opts" object
 */
var opts = params.getOpts();

/**
  * Opitons (Parameters / Arguments) count equals to the number of specified arguments, 
  * not the total count of all parameters you pass them to program from the command line
  * And the empty parameters will be ignored, and not included in the option count
  */
var optCount = params.getOptCount();

// do something if you don't get the right number of arguments
if (optCount < 1) {
    console.error("Not enough parameters provide");
    // print out the usage before exiting the program
    process.exit();
}    


// getting all the inputs, which is an array type even only one input is provided
var inputs = opts['---'];


```


Also you can see [this project][https://github.com/tyolab/table-exporter] for example usage.

## Maintainer

[Eric Tang](https://twitter.com/_e_tang) @ [TYO Lab](http://tyo.com.au)

