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
var combineMultipleReducers_1 = require("../utils/combineMultipleReducers");
var Dynadux = /** @class */ (function () {
    function Dynadux(_config) {
        var _this = this;
        this._config = _config;
        this._dispatches = [];
        this._isDispatching = false;
        this.dispatch = function (action, payload) {
            _this._dispatches.push({ action: action, payload: payload });
            _this._dispatch();
        };
        this.dispatchMethod = function (action, method) {
            _this._dispatches.push({ action: action, method: method });
            _this._dispatch();
        };
        this._dispatch = function () {
            if (_this._isDispatching)
                return;
            _this._isDispatching = true;
            var dispatchItem = _this._dispatches.shift();
            if (!dispatchItem) {
                _this._isDispatching = false;
                return;
            }
            var action = dispatchItem.action, payload = dispatchItem.payload, method = dispatchItem.method;
            var reducer = _this._reducers[action];
            var initialState = _this._state;
            var newState = __assign({}, _this._state);
            var _a = _this._config.middlewares, middlewares = _a === void 0 ? [] : _a;
            middlewares.forEach(function (_a) {
                var before = _a.before;
                if (!before)
                    return;
                newState = __assign(__assign({}, newState), (before({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                }) || {}));
            });
            var reducerStart = Date.now();
            if (reducer)
                newState = __assign(__assign({}, _this._state), (reducer({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                }) || {}));
            if (method) {
                newState = __assign(__assign({}, _this._state), (method({
                    action: action,
                    dispatch: _this.dispatch,
                    state: newState,
                }) || {}));
            }
            var reducerElapsedMs = Date.now() - reducerStart;
            middlewares.forEach(function (_a) {
                var after = _a.after;
                if (!after)
                    return;
                newState = __assign(__assign({}, newState), (after({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                    initialState: initialState,
                    reducerElapsedMs: reducerElapsedMs,
                }) || {}));
            });
            _this._state = newState;
            if (_this._config.onChange)
                _this._config.onChange(_this._state);
            if (_this._config.onDispatch)
                _this._config.onDispatch(action, payload);
            _this._isDispatching = false;
            _this._dispatch();
        };
        var _a = this._config, _b = _a.initialState, initialState = _b === void 0 ? {} : _b, _c = _a.middlewares, middlewares = _c === void 0 ? [] : _c;
        this._state = initialState;
        this._reducers =
            Array.isArray(this._config.reducers)
                ? combineMultipleReducers_1.combineMultipleReducers.apply(void 0, this._config.reducers) : this._config.reducers || {};
        middlewares.forEach(function (middleware) { return middleware.init && middleware.init(_this); });
    }
    Object.defineProperty(Dynadux.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    return Dynadux;
}());
exports.Dynadux = Dynadux;
//# sourceMappingURL=Dynadux.js.map