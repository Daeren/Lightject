//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

(function() {
    "use strict";

    //-----------------------------------------------------

    var gReMatchFuncArgs     = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        gReFilterFuncArgs    = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))|[\s\t\n]+/gm,
        gReSplitFuncArgs     = /,/g,

        gReFuncName          = /^function\s?([^\s(]*)/;

    //-----------------------------------------------------

    module.exports = global.$injector = createInstance();

    //-----------------------------------------------------

    function createInstance() {
        var injValues, injOnCaller;

        //--------------------]>

        function injector(srcFunc, binds) {
            var i, arg;

            var strFunc, strFuncArgs,
                funcName, funcArgs, argsLen, callStack;

            //-----------]>

            if(Array.isArray(srcFunc)) {
                funcArgs = srcFunc;
                srcFunc = funcArgs.pop();

                if(typeof(srcFunc) !== "function") {
                    return null;
                }

                strFunc = srcFunc.toString();
            }
            else if(typeof(srcFunc) === "function") {
                strFunc = srcFunc.toString();
                strFuncArgs = strFunc.match(gReMatchFuncArgs);
            }
            else {
                return null;
            }

            //-------)>

            if(injOnCaller) {
                funcName = strFunc.match(gReFuncName);
                funcName = funcName && funcName[1] ? funcName[1] : "[anon]";
            }

            //--)>

            if(strFuncArgs && strFuncArgs[1]) {
                strFuncArgs = strFuncArgs[1].replace(gReFilterFuncArgs, "");

                if(strFuncArgs) {
                    funcArgs = strFuncArgs.split(gReSplitFuncArgs);
                }
            }

            //----)>

            if(funcArgs) {
                argsLen = funcArgs.length;

                if(argsLen) {
                    callStack = new Array(argsLen);
                }
            }

            //-----------]>

            return caller;

            //-----------]>

            function caller(data, ctx) {
                if(injOnCaller) {
                    injOnCaller(funcName, data, ctx);
                }

                if(!argsLen || !data && !binds && !injValues) {
                    return ctx ? srcFunc.apply(ctx) : srcFunc();
                }

                i = argsLen;

                while(i--) {
                    arg = funcArgs[i];
                    callStack[i] = hasOwnProperty.call(data, arg) ? data[arg]
                        : (binds && hasOwnProperty.call(binds, arg) ? binds[arg]
                        : injValues && hasOwnProperty.call(injValues, arg) && injValues[arg]);
                }

                return srcFunc.apply(ctx || srcFunc, callStack);
            }
        }

        //--------------------]>

        injector.value = function(key, value) {
            setValue(key, value);
            return injector;
        };

        injector.service = function(name, CFunc) {
            setValue(name, new CFunc());
            return injector;
        };

        injector.factory = function(name, func) {
            setValue(name, injector.run(func));
            return injector;
        };

        //-------)>

        injector.table = function(table, binds) {
            if(!table || typeof(table) !== "object") {
                return null;
            }

            for(var name in table) {
                if(!hasOwnProperty.call(table, name)) {
                    continue;
                }

                var e = table[name];

                if(typeof(e) === "function") {
                    table[name] = injector(e, binds);
                }
            }

            return table;
        };

        injector.run = function(f, data, ctx) {
            f = injector(f);
            return f ? f(data, ctx) : f;
        };

        //---)>

        injector.runTable = function(table, data, ctx) {
            if(!table || typeof(table) !== "object") {
                return null;
            }

            for(var name in table) {
                if(!hasOwnProperty.call(table, name)) {
                    continue;
                }

                var e = table[name];

                if(typeof(e) === "function") {
                    injector.run(e, data, ctx);
                }
            }

            return table;
        };

        injector.execTable = function(table, data, ctx) {
            if(!table || typeof(table) !== "object") {
                return null;
            }

            for(var name in table) {
                if(!hasOwnProperty.call(table, name)) {
                    continue;
                }

                var e = table[name];

                if(typeof(e) === "function") {
                    table[name] = injector.run(e, data, ctx);
                }
            }

            return table;
        };

        //-------)>

        injector.onCaller = function(f) {
            if(typeof(f) !== "function") {
                throw new Error("onCaller: is not a function");
            }

            injOnCaller = f;

            return injector;
        };

        //-------)>

        injector.createInstance = createInstance;

        //-------------------------------]>

        return injector;

        //--------[HELPERS]--------}>

        function setValue(key, value) {
            injValues = injValues || {};
            injValues[key] = value;
        }
    }
})();