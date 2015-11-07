//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

module.exports = function() {
    for(var i in arguments[0])
        if(arguments[0].hasOwnProperty(i))
            module[i] = arguments[0][i];

    __filename = module.filename;
    __dirname = module.dirname;

    return eval(arguments[1]);
};