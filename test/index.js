//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

/*jshint expr: true*/
/*global describe, it*/

"use strict";

//-----------------------------------------------------

const rChai     = require("chai");

const expect    = rChai.expect;

const rInjector = require("./../index");

//-----------------------------------------------------

const gMethods = [
    "value", "service", "factory",
    "table", "run",
    "runTable", "execTable",
    "onCaller",
    "createInstance"
];

//-----------------------------------------------------

describe("Module: injector", function() {

    it("Require", function() {
        expect(rInjector).to.be.a("function");
        expect($injector).to.be.a("function");

        expect(rInjector).to.equal($injector);
    });

    for(let method of gMethods) {
        it("[+] " + method, function() {
            expect(rInjector).to.have.property(method).that.is.an("function");
        });
    }

    //-----------------]>

    it("run - value:service:factory", function() {
        rInjector
            .value("dx", 1)
            .service("dy", function dy() { this.v = 5; })
            .factory("dz", function dz() { return {"v": 10}; });

        let result;

        //----]>

        result = rInjector.run(function(dx) {
            return dx * 5;
        });

        expect(result).to.equal(5);

        result = rInjector.run(function(dx, dy) {
            return dx * 5 + dy.v;
        });

        expect(result).to.equal(10);

        result = rInjector.run(function(dz, dx, dy) {
            return dx * 5 + dy.v + dz.v;
        });

        expect(result).to.equal(20);

        //----]>

        result = rInjector.run(["dx", function(tx) {
            return tx * 5;
        }]);

        expect(result).to.equal(5);

        result = rInjector.run(["dx", "dy", function(tx, ty) {
            return tx * 5 + ty.v;
        }]);

        expect(result).to.equal(10);

        result = rInjector.run(["dz", "dx", "dy", function(tz, tx, ty) {
            return tx * 5 + ty.v + tz.v;
        }]);

        expect(result).to.equal(20);
    });

    it("run.data - value:service:factory", function() {
        rInjector
            .value("dx", 1)
            .service("dy", function dy() { this.v = 5; })
            .factory("dz", function dz() { return {"v": 10}; });

        let result;

        //----]>

        result = rInjector.run(function(dx, dw) {
            return dx * 5 + dw;
        }, {"dw": 100});

        expect(result).to.equal(105);

        result = rInjector.run(function(dx, dw, dy) {
            return dx * 5 + dy.v + dw;
        }, {"dw": 100});

        expect(result).to.equal(110);

        result = rInjector.run(function(dz, dw, dx, dy) {
            return dx * 5 + dy.v + dz.v + dw;
        }, {"dw": 100});

        expect(result).to.equal(120);

        //----]>

        result = rInjector.run(["dw", "dx", function(tw, tx) {
            return tx * 5 + tw;
        }], {"dw": 100});

        expect(result).to.equal(105);

        result = rInjector.run(["dx", "dw", "dy", function(tx, tw, ty) {
            return tx * 5 + ty.v + tw;
        }], {"dw": 100});

        expect(result).to.equal(110);

        result = rInjector.run(["dz", "dx", "dy", "dw", function(tz, tx, ty, tw) {
            return tx * 5 + ty.v + tz.v + tw;
        }], {"dw": 100});

        expect(result).to.equal(120);
    });

    it("run.ctx - value:service:factory", function() {
        rInjector
            .value("dx", 1)
            .service("dy", function dy() { this.v = 5; })
            .factory("dz", function dz() { return {"v": 10}; });

        const ctx = {"dw": 100};

        let result;

        //----]>

        result = rInjector.run(function(dx) {
            return dx * 5 + this.dw;
        }, null, ctx);

        expect(result).to.equal(105);

        result = rInjector.run(function(dx, dy) {
            return dx * 5 + dy.v + this.dw;
        }, null, ctx);

        expect(result).to.equal(110);

        result = rInjector.run(function(dz, dx, dy) {
            return dx * 5 + dy.v + dz.v + this.dw;
        }, null, ctx);

        expect(result).to.equal(120);

        //----]>

        result = rInjector.run(["dx", function(tx) {
            return tx * 5 + this.dw;
        }], null, ctx);

        expect(result).to.equal(105);

        result = rInjector.run(["dx", "dy", function(tx, ty) {
            return tx * 5 + ty.v + this.dw;
        }], null, ctx);

        expect(result).to.equal(110);

        result = rInjector.run(["dz", "dx", "dy", function(tz, tx, ty) {
            return tx * 5 + ty.v + tz.v + this.dw;
        }], null, ctx);

        expect(result).to.equal(120);
    });

    it("run (func.string) - value:service:factory", function() {
        rInjector
            .value("dx", 1)
            .service("dy", function dy() { this.v = 5; })
            .factory("dz", function dz() { return {"v": 10}; });

        let result;

        //----]>

        result = rInjector.run((function(dx) {
            return dx * 5;
        }).toString());

        expect(result).to.equal(5);

        result = rInjector.run((function(dx, dy) {
            return dx * 5 + dy.v;
        }).toString());

        expect(result).to.equal(10);

        result = rInjector.run((function(dz, dx, dy) {
            return dx * 5 + dy.v + dz.v;
        }).toString());

        expect(result).to.equal(20);

        //----]>

        result = rInjector.run(["dx", (function(tx) {
            return tx * 5;
        }).toString()]);

        expect(result).to.equal(5);

        result = rInjector.run(["dx", "dy", (function(tx, ty) {
            return tx * 5 + ty.v;
        }).toString()]);

        expect(result).to.equal(10);

        result = rInjector.run(["dz", "dx", "dy", (function(tz, tx, ty) {
            return tx * 5 + ty.v + tz.v;
        }).toString()]);

        expect(result).to.equal(20);
    });

    //-----------------]>

    it("funcInstance - value:service:factory", function() {
        rInjector
            .value("dx", 1)
            .service("dy", function dy() { this.v = 5; })
            .factory("dz", function dz() { return {"v": 10}; });

        let result;

        //----]>

        result = rInjector(function(dx) {
            return dx * 5;
        })();

        expect(result).to.equal(5);

        result = rInjector(function(dx, dy) {
            return dx * 5 + dy.v;
        })();

        expect(result).to.equal(10);

        result = rInjector(function(dz, dx, dy) {
            return dx * 5 + dy.v + dz.v;
        })();

        expect(result).to.equal(20);

        //----]>

        result = rInjector(["dx", function(tx) {
            return tx * 5;
        }])();

        expect(result).to.equal(5);

        result = rInjector(["dx", "dy", function(tx, ty) {
            return tx * 5 + ty.v;
        }])();

        expect(result).to.equal(10);

        result = rInjector(["dz", "dx", "dy", function(tz, tx, ty) {
            return tx * 5 + ty.v + tz.v;
        }])();

        expect(result).to.equal(20);
    });

    //-----------------]>

    it("valueOf:toString", function() {
        const func = function(dx) {
            return dx * 5;
        };

        const strFunc = func.toString();
        const injFunc = rInjector(func);

        //-----]>

        expect(injFunc + 1).to.equal(func + 1);
        expect(injFunc + "").to.equal(strFunc);
    });
});