//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.0.4
//
//-----------------------------------------------------

//-----------------------------------------------------

var $injector = (function createInstance() {
    "use strict";

    //-------------------------------]>

    var gValues;

    //--------------------]>

    injector.value = function(key, value) {
        setValue(key, value);
        return injector;
    };

    injector.service = function(name, func) {
        setValue(name, new func());
        return injector;
    };

    injector.factory = function(name, func) {
        setValue(name, injector.run(func));
        return injector;
    };

    //-------)>

    injector.table = function(table, binds) {
        for(var name in table) {
            if(!Object.prototype.hasOwnProperty.call(table, name))
                continue;

            var e = table[name];

            if(typeof(e) === "function")
                table[name] = injector(e, binds);
        }

        return table;
    };

    injector.run = function(f, data, ctx) {
        f = injector(f);
        return f ? f(data, ctx) : f;
    };

    //-------)>

    injector.createInstance = createInstance;

    //-------------------------------]>

    return injector;

    //-------------------------------]>

    function injector(f, binds) {
        if(typeof(f) !== "function")
            return null;

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
            if(!argsLen || !data && !binds && !gValues)
                return f.apply(ctx|| f);

            i = argsLen;

            while(i--) {
                arg = funcArgs[i];
                callStack[i] = data && data[arg] || binds && binds[arg] || gValues && gValues[arg];
            }

            return f.apply(ctx || f, callStack);
        }
    }

    function setValue(key, value) {
        gValues = gValues || {};
        gValues[key] = value;
    }
})();

//-----------------------------------------------------

if(typeof(module) == "object") {
    module.exports = global.$injector = $injector;
}