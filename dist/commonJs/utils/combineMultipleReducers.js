"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineMultipleReducers = function () {
    var reducerDics = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducerDics[_i] = arguments[_i];
    }
    var output = {};
    reducerDics
        .forEach(function (reducerDic) {
        Object.keys(reducerDic)
            .forEach(function (action) {
            if (!output[action]) {
                output[action] = reducerDic[action];
                return;
            }
            var originalReducer = output[action];
            output[action] = function (params) {
                var stateA = params.state || {};
                var stateB = originalReducer(__assign(__assign({}, params), { state: stateA }));
                return reducerDic[action](__assign(__assign({}, params), { state: __assign(__assign({}, stateA), stateB) }));
            };
        });
    });
    return output;
};
//# sourceMappingURL=combineMultipleReducers.js.map