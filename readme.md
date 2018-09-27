[![Codacy][cod_b]][cod_l] ![NodeSecurity][node_sec_b]

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
    .service("y", function(x) { this.v = 1 + x; })
    .factory("z", function(x, y) { return {"v": 3 + x + y.v}; });
    
print = $injector(fLog, binds);
print(data, ctx);

$injector.run(fLog, data, ctx);
$injector.run(["x", "y", (d1, d2) => d1 + d2.v]);

//-------------]>

function fLog(input, output, myBind) {
    output(input + this.payload + myBind);
}
```

* Coverage: +
* Benchmark: +
* Browser: +
* valueOf/toString: +


#### Module

| Method          | Arguments                         | Return                           |
|-----------------|-----------------------------------|----------------------------------|
|                 | -                                 |                                  |
| createInstance  |                                   | this                             |
|                 | -                                 |                                  |
| onCaller        | callback(name, data, ctx, func)   | this or exception                |
|                 | -                                 |                                  |
| value           | name, value                       | this                             |
| service         | name, func                        | this                             |
| factory         | name, func                        | this                             |
|                 | -                                 |                                  |
| table           | table[, binds]                    | table or null                    |
|                 | -                                 |                                  |
| run             | f, data[, ctx]                    | result of a function or null     |
| runTable        | table, data[, ctx]                | table or null                    |
| execTable       | table, data[, ctx]                | overwritten table or null        |


#### System variables

| Name      | Desc                                |
|-----------|-------------------------------------|
| $in       |                                     | 


## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io

[cod_b]: https://img.shields.io/codacy/5ce7382c312d4cd091acabd06bfcde15.svg
[cod_l]: https://www.codacy.com/app/daeren/Lightject/dashboard

[node_sec_b]: https://nodesecurity.io/orgs/xiii/projects/39b19817-5525-4498-93e5-a2887f20e901/badge