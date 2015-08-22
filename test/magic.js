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

var func = function(x, y, z, t) { return x + y + z + t; };

func = $injector(func, {t: 9});
console.log(func({x: 1, y: 2, z: 3}));


func = function() { return this.t; };
func.t = 6;

func = $injector(func);
console.log(func({x: 1, y: 2, z: 3}, {t: 1}));

func = function(t) { return t; };

func = $injector(func, {t: 1});
console.log(func(null));