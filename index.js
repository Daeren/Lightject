//-----------------------------------------------------
//
// Author: Daeren Torn
// Site: 666.io
// Version: 0.0.7
//
//-----------------------------------------------------

//-----------------------------------------------------

var $injector = (function createInstance() {
    "use strict";

    //-------------------------------]>

    var gValues,

        gOnCaller;

    var gReMatchFuncArgs     = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        gReFilterFuncArgs    = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))|[\s\t\n]+/gm,
        gReSplitFuncArgs     = /,/g,

        gReFuncName          = /^function\s?([^\s(]*)/;

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
        if(!table || typeof(table) !== "object")
            return null;

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

    //---)>
    
    injector.runTable = function(table, data, ctx) {
        if(!table || typeof(table) !== "object")
            return null;

        for(var name in table) {
            if(!Object.prototype.hasOwnProperty.call(table, name))
                continue;

            var e = table[name];

            if(typeof(e) === "function")
                injector.run(e, data, ctx);
        }

        return table;
    };

    injector.execTable = function(table, data, ctx) {
        if(!table || typeof(table) !== "object")
            return null;

        for(var name in table) {
            if(!Object.prototype.hasOwnProperty.call(table, name))
                continue;

            var e = table[name];

            if(typeof(e) === "function")
                table[name] = injector.run(e, data, ctx);
        }

        return table;
    };

    //-------)>

    injector.onCaller = function(f) {
        if(typeof(f) !== "function")
            throw new Error("onCaller: arg is not a function!");

        gOnCaller = f;

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
            strFuncArgs = strFunc.match(gReMatchFuncArgs);
        } else
            return null;

        //-------)>

        if(gOnCaller) {
            funcName = strFunc.match(gReFuncName);
            funcName = funcName && funcName[1] ? funcName[1] : "[anon]";
        }

        if(strFuncArgs && strFuncArgs[1]) {
            strFuncArgs = strFuncArgs[1].replace(gReFilterFuncArgs, "");

            if(strFuncArgs)
                funcArgs = strFuncArgs.split(gReSplitFuncArgs);
        }

        //----)>

        if(funcArgs) {
            argsLen = funcArgs.length;

            if(argsLen)
                callStack = new Array(argsLen);
        }

        //-----------]>

        return caller;

        //-----------]>

        function caller(data, ctx) {
            if(gOnCaller)
                gOnCaller(funcName, data, ctx);

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