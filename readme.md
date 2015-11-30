[![Codacy][cod_b]][cod_l]

`npm install lightject`


```js
require("lightject")

let ctx = {
        "payload": "!"
    };

let binds = {
        "myBind": "?"
    };

let data = {
        "myBind": "Replace!",

        "input":  "Simple start",
        "output": console.log
    };

let print;

//-------------]>

$injector
    .value("x", 0)
    .service("y", function() { this.v = 1; })
    .factory("z", function() { return {"v": 3}; });
    
print = $injector(fLog, binds);
print(data, ctx);

$injector.run(fLog, data, ctx);
$injector.run(["x", "y", function(d1, d2) { return d1 + d2.v; }]);

//-------------]>

function fLog(input, output, myBind) {
    output(input + this.payload + myBind);
}
```

* Benchmark: +
* Browser: +


| Method          | Arguments               | Return                           |
|-----------------|-------------------------|----------------------------------|
|                 | -                       |                                  |
| createInstance  |                         | this                             |
| onCaller        | callback(name, data)    | this or exception                |
|                 | -                       |                                  |
| value           | key, value              | this                             |
| service         | name, func              | this                             |
| factory         | name, func              | this                             |
|                 | -                       |                                  |
| table           | table[, binds]          | table or null                    |
|                 | -                       |                                  |
| run             | f, data[, ctx]          | result of a function or null     |
| runTable        | table, data[, ctx]      | table or null                    |
| execTable       | table, data[, ctx]      | overwritten table or null        |


#### 2# of the fundamental modules
[3# Aigis][2]

## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://www.npmjs.com/package/aigis

[cod_b]: https://img.shields.io/codacy/88b55f71c45a47838d24ed1e5fd2476c.svg
[cod_l]: https://www.codacy.com/app/daeren/Lightject/dashboard