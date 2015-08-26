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
    data    = {x: 1, y: 2, z: 3};

var func    = function(x, y, z, t) { return x + y + z + (t || this.t); };
var dfunc   = function(dx, dy, dz) { return "" + dx + dy.v + dz.v; };

//--------)>

$injector
    .value("dx", 0)
    .service("dy", function() { this.v = 1; })
    .factory("dz", function() { return {"v": 3}; });

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