"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynadux_1 = require("../Dynadux/Dynadux");
exports.createStoreByMethods = function (config) {
    var initialState = config.initialState, 
    // methods,
    middlewares = config.middlewares, onChange = config.onChange, onDispatch = config.onDispatch;
    var dynadux = new Dynadux_1.Dynadux({
        initialState: initialState,
        reducers: {},
        // Object.keys(methods)
        //   .reduce((acc: IDynaduxReducerDic<TState>, methodName: string) => {
        //     acc[methodName] = params => methods[methodName](params);
        //     return acc;
        //   }, {}),
        middlewares: middlewares,
        onChange: onChange,
        onDispatch: onDispatch,
    });
    return {
        dispatchMethod: dynadux.dispatchMethod,
        get state() { return dynadux.state; },
    };
};
//# sourceMappingURL=createStoreByMethods.js.map