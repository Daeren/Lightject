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
        gReSplitFuncArgs     = /,/,

        gReFuncName          = /^function\s?([^\s(]*)/;

    //-----------------------------------------------------

    (function(main) {
        if(!module || typeof(module) !== "object") {
            $injector = main;
        }
        else {
            if(global && typeof(global) === "object") {
                global.$injector = main;
            }

            module.exports = main;
        }
    })(createInstance());

    //-----------------------------------------------------

    function createInstance() {
        var injVariables, injOnCaller;

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

                if(!argsLen || !data && !binds && !injVariables) {
                    return ctx ? srcFunc.apply(ctx) : srcFunc();
                }

                i = argsLen;

                while(i--) {
                    arg = funcArgs[i];

                    callStack[i] = data && hasOwnProperty.call(data, arg) ? data[arg] :
                        (
                            binds && hasOwnProperty.call(binds, arg) ? binds[arg] :
                            injVariables && hasOwnProperty.call(injVariables, arg) && injVariables[arg]
                        );
                }

                return srcFunc.apply(ctx || srcFunc, callStack);
            }
        }

        //--------------------]>

        injector.value          = mthInjValue;
        injector.service        = mthInjService;
        injector.factory        = mthInjFactory;

        injector.table          = mthInjTable;
        injector.run            = mthInjRun;

        injector.runTable       = mthInjRunTable;
        injector.execTable      = mthInjExecTable;

        injector.onCaller       = mthOnCaller;

        injector.createInstance = createInstance;

        //-------------------------------]>

        return injector;

        //--------[INJ: Methods]--------}>

        function mthInjValue(name, value) {
            return value === null ? delVariable(name) : setVariable(name, value);
        }

        function mthInjService(name, CFunc) {
            return CFunc === null ? delVariable(name) : setVariable(name, new CFunc());
        }

        function mthInjFactory(name, func) {
            return func === null ? delVariable(name) : setVariable(name, injector.run(func));
        }

        //---)>

        function mthInjTable(table, binds) {
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
        }

        function mthInjRun(f, data, ctx) {
            f = injector(f);
            return f ? f(data, ctx) : f;
        }

        //---)>

        function mthInjRunTable(table, data, ctx) {
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
        }

        function mthInjExecTable(table, data, ctx) {
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
        }

        //---)>

        function mthOnCaller(f) {
            if(typeof(f) !== "function") {
                throw new Error("onCaller: is not a function");
            }

            injOnCaller = f;

            return injector;
        }

        //--------[HELPERS]--------}>

        function setVariable(name, value) {
            injVariables = injVariables || {};
            injVariables[name] = value;

            return injector;
        }

        function delVariable(name) {
            if(injVariables) {
                delete injVariables[name];
            }

            return injector;
        }
    }
})();