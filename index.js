//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

var $injector;

//-----------------------------------------------------

(function() {
    "use strict";

    //-----------------------------------------------------

    (function() {
        var gReMatchFuncArgs     = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
            gReRemoveFuncHead    = /^function\s*[^\(]*\(\s*(?:[^\)]*)\)\s*\{/m,
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
                var t, i, arg;

                var strFunc, strFuncArgs,
                    isArrayFunc,
                    funcName, funcArgs, funcBody, argsLen, callStack;

                //-----------]>

                if(!srcFunc) {
                    return null;
                }

                if(typeof(srcFunc) === "function") {
                    strFunc = srcFunc.toString();
                    strFuncArgs = extractFuncArgsStr(strFunc);
                }
                else if(Array.isArray(srcFunc)) {
                    funcArgs = srcFunc;
                    srcFunc = funcArgs.pop();

                    if(typeof(srcFunc) === "function") {
                        strFunc = srcFunc.toString();
                    }

                    isArrayFunc = true;
                }

                if(typeof(srcFunc) === "string") {
                    strFunc = srcFunc;
                    strFuncArgs = extractFuncArgsStr(strFunc);

                    funcBody = strFunc.trim().slice(0, -1).replace(gReRemoveFuncHead, "");
                }

                if(!strFunc) {
                    return null;
                }

                //-------)>

                if(injOnCaller) {
                    funcName = strFunc.match(gReFuncName);
                    funcName = funcName && funcName[1] || "[anon]";
                }

                if(!isArrayFunc) {
                    funcArgs = strFuncArgs.split(gReSplitFuncArgs);
                }

                if(funcArgs) {
                    argsLen = funcArgs.length;

                    if(argsLen) {
                        callStack = new Array(argsLen);
                    }
                }

                if(funcBody) {
                    srcFunc = createFunction(strFuncArgs, funcBody);
                }

                //-----------]>

                caller.valueOf = mthCallerValueOf;
                caller.toString = mthCallerToString;

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
                        t = data && data[arg];

                        callStack[i] = data && typeof(t) !== "undefined" ? t :
                            (
                                t = binds && binds[arg],

                                    binds && typeof(t) !== "undefined" ? t :
                                    (
                                        t = injVariables && injVariables[arg],

                                            injVariables && typeof(t) !== "undefined" ? t :
                                            (
                                                arg === "$in" ? data : undefined
                                            )
                                    )
                            );
                    }

                    if(ctx) {
                        return srcFunc.apply(ctx, callStack);
                    }

                    switch(argsLen) {
                        case 1: return callWArgs1(srcFunc, callStack);
                        case 2: return callWArgs2(srcFunc, callStack);
                        case 3: return callWArgs3(srcFunc, callStack);
                        case 4: return callWArgs4(srcFunc, callStack);

                        default: srcFunc.apply(srcFunc, callStack);
                    }
                }

                //----------]>

                function callWArgs1(f, s) {
                    return f(s[0]);
                }

                function callWArgs2(f, s) {
                    return f(s[0], s[1]);
                }

                function callWArgs3(f, s) {
                    return f(s[0], s[1], s[2]);
                }

                function callWArgs4(f, s) {
                    return f(s[0], s[1], s[2], s[3]);
                }

                //----------]>

                function mthCallerValueOf() {
                    return srcFunc.valueOf();
                }

                function mthCallerToString() {
                    return srcFunc.toString();
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
                if(CFunc === null) {
                    return delVariable(name);
                }

                //------]>

                function CMirror() {
                    injector.run(CFunc, null, this);
                }

                CMirror.prototype = CFunc.prototype;

                //------]>

                return setVariable(name, new CMirror());
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
                    if(hasOwnProperty.call(table, name)) {
                        var e = table[name];

                        if(typeof(e) === "function") {
                            table[name] = injector(e, binds);
                        }
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
                    if(hasOwnProperty.call(table, name)) {
                        var e = table[name];

                        if(typeof(e) === "function") {
                            injector.run(e, data, ctx);
                        }
                    }
                }

                return table;
            }

            function mthInjExecTable(table, data, ctx) {
                if(!table || typeof(table) !== "object") {
                    return null;
                }

                for(var name in table) {
                    if(hasOwnProperty.call(table, name)) {
                        var e = table[name];

                        if(typeof(e) === "function") {
                            table[name] = injector.run(e, data, ctx);
                        }
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

        //-------------]>

        function extractFuncArgsStr(str) {
            var args = str && str.match(gReMatchFuncArgs);
            args = args && args[1];

            return args ? args.replace(gReFilterFuncArgs, "") : "";
        }
    })();

    //-----------------------------------------------------

    function createFunction(args, body) {
        return new Function(args, body);
    }
})();