//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

require("./../index");

//-----------------------------------------------------

var ctx     = {t: 9},
    binds   = {t: 100},
    data    = {x: 0, y: 2, z: 3};

var func    = function func(x, y, z, t) { return x + y + z + (t || this.t); };
var dfunc   = function dfunc(dx, dy, dz) { return "" + dx + dy.v + dz.v; };

//--------)>

$injector.onCaller(function logger(name, data, ctx, func) {
    console.log("\n-------------------");
    console.log(name, ":", JSON.stringify(data));
    console.log("ctx:", ctx);
    console.log(func && func.toString() || "[empty]");
});

$injector
    .value("dx", 0)
    .service("dy", function dy() { this.v = 1; })
    .factory("dz", function dz() { return {"v": 3}; });

//---------------------------]>

console.log($injector.run(func, data, ctx));

//------------]>

func = $injector(func, binds);
console.log(func(data));

//------------]>

func = function() { return this.t; };
func.t = 6;

func = $injector(func);
console.log(func(data, ctx));

//------------]>

console.log($injector.run(dfunc));

//------------]>

func = function(t) { return t; };

func = $injector(func, binds);
console.log(func(null));

//------------]>

func = ["x", "y", "z", function(d1, d2, d3) { return "" + d3 + d2 + d1; }];

console.log($injector.run(func, data));

//---)>

func = ["x", "y", "z", (d1, d2, d3) => ("" + d3 + d2 + d1)];

console.log($injector.run(func, data));

//------------]>

func = () => this.t;
func.t = 9;

func = $injector(func);
console.log(func(data, ctx));

//------------]>

$injector.run(function(x) {
    console.log(x);
}, {x: 6});

$injector.run((x) => {
    console.log(x);
}, {x: 6});

$injector.run((function(x) {
    console.log(x);
}).toString(), {x: 6});

$injector.run(((x) => {
    console.log(x);
}).toString(), {x: 6});
