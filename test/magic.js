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

func = function(t) { return t; };

func = $injector(func, binds);
console.log(func(null));