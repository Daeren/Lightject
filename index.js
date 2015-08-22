//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.0.1
//
//-----------------------------------------------------

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = global.$injector = $injector;
}

//-----------------------------------------------------

function $injector(f, binds) {
    if(typeof(f) !== "function") return null;

    var strFunc     = f.toString(),
        strFuncArgs = strFunc.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m);

    var i, arg,
        funcArgs, argsLen, callStack;

    if(strFuncArgs[1]) {
        strFuncArgs = strFuncArgs[1].replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))|[\s\t\n]+/gm, "");

        if(strFuncArgs) {
            funcArgs = strFuncArgs.split(/,/g);
            argsLen = funcArgs.length;

            if(argsLen)
                callStack = new Array(argsLen);
        }
    }

    return caller;

    function caller(data, ctx) {
        if(!argsLen || !data && !binds)
            return f.apply(ctx|| f);

        i = argsLen;

        while(i--) {
            arg = funcArgs[i];
            callStack[i] = data[arg] || binds && binds[arg];
        }

        return f.apply(ctx || f, callStack);
    }
}
