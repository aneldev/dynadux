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
var Dynadux = /** @class */ (function () {
    function Dynadux(_config) {
        var _this = this;
        this._config = _config;
        this.dispatch = function (action, payload) {
            var reducer = _this._config.reducers[action];
            if (!reducer)
                throw { message: "Reducer not found for action \"" + action + "\"" };
            _this._state = __assign(__assign({}, _this._state), reducer({
                action: action,
                payload: payload,
                dispatch: _this.dispatch,
                state: _this._state,
            }));
            if (_this._config.onChange)
                _this._config.onChange(_this.getState());
        };
        this._state = _config.initialState || {};
        this.getState = this.getState.bind(this);
    }
    Dynadux.prototype.getState = function () {
        return this._state;
    };
    return Dynadux;
}());
exports.Dynadux = Dynadux;
//# sourceMappingURL=Dynadux.js.map