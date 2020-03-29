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
exports.convertToSectionReducers = function (section, sectionReducers) {
    return Object.keys(sectionReducers)
        .reduce(function (acc, action) {
        var originalReducer = sectionReducers[action];
        acc[action] = function (params) {
            var _a;
            var subPartialState = originalReducer(__assign(__assign({}, params), { state: params.state[section] }));
            if (subPartialState)
                return _a = {},
                    _a[section] = __assign(__assign({}, params.state[section]), subPartialState),
                    _a;
        };
        return acc;
    }, {});
};
//# sourceMappingURL=convertToSectionReducers.js.map