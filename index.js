//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

const rFs           = require("fs"),
      rPath         = require("path");

const rEval         = require("./eval");

//-----------------------------------------------------

const gReMatchFuncArgs     = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
      gReFilterFuncArgs    = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))|[\s\t\n]+/gm,
      gReSplitFuncArgs     = /,/g,

      gReFuncName          = /^function\s?([^\s(]*)/;

//-----------------------------------------------------

module.exports = global.$injector = createInstance();

//-----------------------------------------------------

function createInstance() {
    let injValues,
        injOnCaller;

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
        if(!table || typeof(table) !== "object")
            return null;

        for(let name in table) {
            if(!hasOwnProperty(table, name))
                continue;

            let e = table[name];

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

        for(let name in table) {
            if(!hasOwnProperty(table, name))
                continue;

            let e = table[name];

            if(typeof(e) === "function")
                injector.run(e, data, ctx);
        }

        return table;
    };

    injector.execTable = function(table, data, ctx) {
        if(!table || typeof(table) !== "object")
            return null;

        for(let name in table) {
            if(!hasOwnProperty(table, name))
                continue;

            let e = table[name];

            if(typeof(e) === "function")
                table[name] = injector.run(e, data, ctx);
        }

        return table;
    };

    //-------)>

    injector.include = function(file, data) {
        const mdlPaths = [];

        let code, srcFile, fileName, dirName, globalVars;
        let curPath, lastPath;

        fileName = rPath.normalize(file);
        dirName = rPath.join(fileName, "..");

        srcFile = rFs.readFileSync(fileName).toString();

        globalVars = Object.keys(data).join();

        do {
            lastPath = curPath;
            curPath = rPath.join(curPath || fileName, "..");

            if(lastPath === curPath)
                break;

            mdlPaths.push(rPath.normalize(curPath + "/node_modules"));
        } while(1);

        //-------------]>

        const ctxEval = {
            "filename": fileName,
            "dirname":  dirName
        };

        //-------------]>

        code = "(function(" + globalVars + ") {";
        code += "\r\n";
        code += "var module = {'exports': {}, 'filename': '" + fileName + "', 'dirname': '" + dirName + "', 'paths': " + JSON.stringify(mdlPaths) + "};";
        code += "\r\n";
        code += "(function(module, exports) {";
        code += "\r\n";
        code += srcFile;
        code += "\r\n";
        code += "})(module, module.exports);";
        code += "\r\n";
        code += "return module.exports;";
        code += "\r\n";
        code += "});";

        return injector(rEval(ctxEval, code))(data);
    };

    //-------)>

    injector.onCaller = function(f) {
        if(typeof(f) !== "function")
            throw new Error("onCaller: arg is not a function!");

        injOnCaller = f;

        return injector;
    };

    //-------)>

    injector.createInstance = createInstance;

    //-------------------------------]>

    return injector;

    //-------------------------------]>

    function injector(srcFunc, binds) {
        let i, arg;

        let strFunc, strFuncArgs,
            funcName, funcArgs, argsLen, callStack;

        //-----------]>

        if(Array.isArray(srcFunc)) {
            funcArgs = srcFunc;
            srcFunc = funcArgs.pop();

            if(typeof(srcFunc) !== "function")
                return null;

            strFunc = srcFunc.toString();
        } else if(typeof(srcFunc) === "function") {
            strFunc = srcFunc.toString();
            strFuncArgs = strFunc.match(gReMatchFuncArgs);
        } else
            return null;

        //-------)>

        if(injOnCaller) {
            funcName = strFunc.match(gReFuncName);
            funcName = funcName && funcName[1] ? funcName[1] : "[anon]";
        }

        //--)>

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
            if(injOnCaller)
                injOnCaller(funcName, data, ctx);

            if(!argsLen || !data && !binds && !injValues)
                return ctx ? srcFunc.apply(ctx) : srcFunc();

            i = argsLen;

            while(i--) {
                arg = funcArgs[i];

                callStack[i] = hasOwnProperty(data, arg) ? data[arg] :
                    (hasOwnProperty(binds, arg) ? binds[arg] : hasOwnProperty(injValues, arg) && injValues[arg]);
            }

            return srcFunc.apply(ctx || srcFunc, callStack);
        }
    }

    //--------[HELPERS]--------}>

    function setValue(key, value) {
        injValues = injValues || {};
        injValues[key] = value;
    }
}

//-------------[HELPERS]--------------}>

function hasOwnProperty(obj, prop) {
    return obj && typeof(obj) === "object" && Object.prototype.hasOwnProperty.call(obj, prop);
}
