//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.0.6
//
//-----------------------------------------------------

//-----------------------------------------------------

var $injector = (function createInstance() {
    "use strict";

    //-------------------------------]>

    var gValues,

        gLogger;

    var reMatchFuncArgs     = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        reFilterFuncArgs    = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))|[\s\t\n]+/gm,
        reSplitFuncArgs     = /,/g,

        reFuncName          = /^function\s?([^\s(]*)/;

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

    injector.logger = function(f) {
        if(typeof(f) !== "function")
            throw new Error("logger: arg is not a function!");

        gLogger = f;

        return injector;
    };

    //-------)>

    injector.createInstance = createInstance;

    //-------------------------------]>

    return injector;

    //-------------------------------]>

    function injector(f, binds) {
        var i, arg;

        var strFunc, strFuncArgs,
            funcName, funcArgs, argsLen, callStack;

        //-----------]>

        if(Array.isArray(f)) {
            funcArgs = f;
            f = funcArgs.pop();

            if(typeof(f) !== "function")
                return null;

            strFunc = f.toString();
        } else if(typeof(f) === "function") {
            strFunc = f.toString();
            strFuncArgs = strFunc.match(reMatchFuncArgs);
        } else
            return null;

        if(gLogger) {
            funcName = strFunc.match(reFuncName);
            funcName = funcName && funcName[1] ? funcName[1] : "[anon]";
        }

        if(strFuncArgs && strFuncArgs[1]) {
            strFuncArgs = strFuncArgs[1].replace(reFilterFuncArgs, "");

            if(strFuncArgs)
                funcArgs = strFuncArgs.split(reSplitFuncArgs);
        }

        if(funcArgs) {
            argsLen = funcArgs.length;

            if(argsLen)
                callStack = new Array(argsLen);
        }

        //-----------]>

        return caller;

        //-----------]>

        function caller(data, ctx) {
            if(gLogger)
                gLogger(funcName, data);

            if(!argsLen || !data && !binds && !gValues)
                return ctx ? f.apply(ctx) : f();

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