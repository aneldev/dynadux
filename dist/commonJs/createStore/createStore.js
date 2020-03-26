"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynadux_1 = require("../Dynadux/Dynadux");
exports.createStore = function (config) {
    var dynadux = new Dynadux_1.Dynadux(config);
    return {
        dispatch: dynadux.dispatch,
        dispatchMethod: dynadux.dispatchMethod,
        get state() { return dynadux.state; },
    };
};
//# sourceMappingURL=createStore.js.map