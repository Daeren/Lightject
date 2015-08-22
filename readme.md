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
		
        "$in": "Simple start",
        "$out": console.log
    };
	
var print = $injector(function($in, $out, myBind) {
    $out($in + this.payload + myBind);
}, binds);

print(data, ctx);
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
