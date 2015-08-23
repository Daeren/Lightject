`npm install lightject`


```js
require("lightject")

var ctx = {
        "payload": "!"
    };

var binds = {
        "myBind": "?"
    };

var data = {
        "myBind": "Replace!",

        "input":  "Simple start",
        "output": console.log
    };

//-------------]>

var print = $injector(fLog, binds);
print(data, ctx);

$injector.run(fLog, data, ctx);

//-------------]>

function fLog(input, output, myBind) {
    output(input + this.payload + myBind);
}
```

* Benchmark: +
* Browser: +


#### 2.5# of the fundamental modules
[3# Aigis][2]

## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://www.npmjs.com/package/aigis
