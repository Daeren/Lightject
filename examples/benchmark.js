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

var l, data, fCookie;

//-----------------------------------------------------

function f13($in, $out) { $out; ($in); }

//-----)>

fCookie = $injector(f13);

//-----------------]>

l = 1000 * 1000 * 1;
data = {"$out": console.log, "$in": "Simple start 0"};

console.time("#1 | with Data");

while(l--) {
    fCookie(data);
}

console.timeEnd("#1 | with Data");

//-----------------]>

l = 1000 * 1000 * 1;

console.time("#1 | without Data");

while(l--) {
    fCookie();
}

console.timeEnd("#1 | without Data");

//-----------------]>

l = 1000 * 1000 * 1;
data = {"$out": console.log};

console.time("#3 | with Data (-1 arg)");

while(l--) {
    fCookie(data);
}

console.timeEnd("#3 | with Data (-1 arg)");

//-----------------]>

l = 1000 * 1000 * 1;
data = {"$out": console.log};

console.time("#4 | [$i].run: with Data");

while(l--) {
    $injector.run(f13, data);
}

console.timeEnd("#4 | [$i].run: with Data");

//-----------------]>

l = 1000 * 1000 * 1;
data = null;

console.time("#5 | [$i].run: without Data");

while(l--) {
    $injector.run(f13, data);
}

console.timeEnd("#5 | [$i].run: without Data");
