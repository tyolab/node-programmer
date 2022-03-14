# node-programmer
I hope it can become A coder/developer's assistant.

## Using Params Library

This library provides an options parsing function.

### Setting all avaliable options



### Command Line
node . --long-option-with-value a-value --long-option-without-value-is-enabling -s "short" input1 input2 input3...

## Example Usage

``` javascript
var optsAvailable = {
    "long": 16,
    "short": 5,
    "test": {default: "Hello World!", type: "string", description: "This is a test option."},
};


```

Please see [this project][https://github.com/tyolab/table-exporter] from example usage.

## Maintainer

[Eric Tang](https://twitter.com/_e_tang) @ [TYO Lab](http://tyo.com.au)

