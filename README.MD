[![Build Status](https://travis-ci.org/alexvictoor/jsHiccup.svg?branch=master)](https://travis-ci.org/alexvictoor/jsHiccup)

# jsHiccup
Working on a complex UI which sometimes freeze?  
jsHiccup might be handy.  
This is a proof of concept aiming to reproduce within a browser what [jHiccup](https://github.com/giltene/jHiccup) provides inside a JVM. 
Go check out this [live demo](https://alexvictoor.github.io/jsHiccup/) and then generate hiccup graphs with [HdrHistogram log analyzer](https://hdrhistogram.github.io/HdrHistogramJSDemo/logparser.html)  
*Note: jsHiccup measures are in micro seconds when displayed in the log analyzer UI*

## Description 
Just like jHiccup, jsHiccup runs a loop and keeps track of the delay between two turns. If the delay is bigger than usual the system, the JavaScript runtime, might have freeze. All the delay are stored in an histogram which is serialized at fixed interval in a log, leveraging on [HdrHistogram](https://github.com/HdrHistogram/HdrHistogramJS). Since HdrHistogram operations might increase the load of your UI, all the costly treatments are done by an HTML5 web worker.
## Usage
jsHiccup is split in two parts:
- a web-worker script, jshiccup.worker.js, in charge of recording hiccup measures in an histogram
- a client script, jshiccup.recorder.js, which runs a timer to detect and measure hiccup times and send them to the web-worker

jshiccup.recorder.js is packaged as a UMD module, hence it can be used directly 
from JavaScript within a browser, as a commonjs / es6 JavaScript module 
or as a TypeScript module.

Both files can be downloaded directly or using npm/yarn.  
Using npm you can get these files with the following command:
```
  npm i jsHiccup
```
Note for TypeScript developers: since jsHiccup has been written in TypeScript, definition files are embedded, no additional task is needed to get them.   
js files are also available from github's release page:
```
<script src="https://github.com/alexvictoor/releases/download/v1.0.0/jshiccup.recorder.js" />
```
Once you have grabbed the two scripts, you can start instrumenting your application with the following code fragment:
```
const worker = new Worker("jshiccup.worker.js");

let buffer = "";                                            // buffer will hold the hdr logs
const logAppender = (line) => buffer += (line + "\r\n");    // you can do something more complex
                                                            // such as pushing the logs to a server

const recorder = new jsHiccup.default(worker, logAppender);
recorder.start();

```