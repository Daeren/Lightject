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

var l, fCookie;

//-----------------------------------------------------

fCookie = $injector(function($in, $out) { ($in); });


l = 1000 * 1000 * 1;

console.time("#1 | with Data");

while(l--)
    fCookie({"$out": console.log, "$in": "Simple start 0"});

console.timeEnd("#1 | with Data");


l = 1000 * 1000 * 1;

console.time("#1 | without Data");

while(l--)
    fCookie();

console.timeEnd("#1 | without Data");


l = 1000 * 1000 * 1;

console.time("#3 | with Data");

while(l--)
    fCookie({"$out": console.log});

console.timeEnd("#3 | with Data");
