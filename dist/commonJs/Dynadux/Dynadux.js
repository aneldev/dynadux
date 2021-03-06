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
var consoleOnce_1 = require("../utils/consoleOnce");
var Dynadux = /** @class */ (function () {
    function Dynadux(_config) {
        var _this = this;
        if (_config === void 0) { _config = {}; }
        this._config = _config;
        this._dispatches = [];
        this._isDispatching = false;
        this.addReducers = function (reducers) {
            _this._reducers = combineMultipleReducers_1.combineMultipleReducers(_this._reducers, reducers);
        };
        this.dispatch = function (action, payload, dispatchConfig) {
            if (dispatchConfig === void 0) { dispatchConfig = {}; }
            _this._dispatches.push({ action: action, payload: payload, dispatchConfig: dispatchConfig });
            _this._dispatch();
        };
        this._onChange = function (state, action, payload) { return undefined; };
        this._dispatch = function () {
            if (_this._isDispatching)
                return;
            _this._isDispatching = true;
            var dispatchItem = _this._dispatches.shift();
            if (!dispatchItem) {
                _this._isDispatching = false;
                return;
            }
            if (typeof dispatchItem.dispatchConfig.triggerChange !== "undefined")
                consoleOnce_1.consoledOnce('warn', 'Dynadux: `triggerChange` config prop is deprecated and will be not accepted on next major version. Use the `blockChange` (with the opposite logic) instead.');
            var action = dispatchItem.action, payload = dispatchItem.payload, _a = dispatchItem.dispatchConfig, _b = _a.blockChange, userBlockChange = _b === void 0 ? false : _b, _c = _a.triggerChange, triggerChange = _c === void 0 ? true : _c;
            var reducer = _this._reducers[action];
            var initialState = _this._state;
            var newState = __assign({}, _this._state);
            var changed = false;
            var blockChange = userBlockChange || !triggerChange;
            var _d = _this._config.middlewares, middlewares = _d === void 0 ? [] : _d;
            try {
                middlewares
                    .filter(Boolean)
                    .forEach(function (_a) {
                    var before = _a.before;
                    if (!before)
                        return;
                    var middlewarePartialChange = before({
                        action: action,
                        payload: payload,
                        dispatch: _this.dispatch,
                        state: newState,
                    });
                    if (!changed && !!middlewarePartialChange)
                        changed = true;
                    if (!middlewarePartialChange)
                        return;
                    newState = __assign(__assign({}, newState), middlewarePartialChange);
                });
            }
            catch (e) {
                console.error('Dynadux: A middleware on `before` raised an exception', e);
            }
            var reducerStart = Date.now();
            try {
                if (reducer) {
                    var reducerPartialState = reducer({
                        action: action,
                        payload: payload,
                        dispatch: _this.dispatch,
                        state: newState,
                        blockChange: function () { return blockChange = true; },
                    });
                    if (!changed && !!reducerPartialState)
                        changed = true;
                    newState = __assign(__assign({}, _this._state), reducerPartialState);
                }
            }
            catch (e) {
                console.error('Dynadux: A reducer raised an exception', e);
            }
            try {
                var reducerElapsedMs_1 = Date.now() - reducerStart;
                middlewares
                    .filter(Boolean)
                    .forEach(function (_a) {
                    var after = _a.after;
                    if (!after)
                        return;
                    var middlewarePartialChange = after({
                        action: action,
                        payload: payload,
                        dispatch: _this.dispatch,
                        state: newState,
                        initialState: initialState,
                        changed: changed,
                        reducerElapsedMs: reducerElapsedMs_1,
                    });
                    if (!changed && !!middlewarePartialChange)
                        changed = true;
                    if (!middlewarePartialChange)
                        return;
                    newState = __assign(__assign({}, newState), middlewarePartialChange);
                });
            }
            catch (e) {
                console.error('Dynadux: A middleware on `after` raised an exception', e);
            }
            _this._state = newState;
            if (changed && !blockChange && _this._config.onChange)
                _this._config.onChange(_this._state, action, payload);
            if (changed && !blockChange)
                _this._onChange(_this._state, action, payload);
            if (_this._config.onDispatch)
                _this._config.onDispatch(action, payload);
            _this._isDispatching = false;
            _this._dispatch();
        };
        var _a = this._config, _b = _a.initialState, initialState = _b === void 0 ? {} : _b, _c = _a.reducers, reducers = _c === void 0 ? {} : _c, _d = _a.middlewares, middlewares = _d === void 0 ? [] : _d;
        this._state = initialState;
        this._reducers =
            Array.isArray(reducers)
                ? combineMultipleReducers_1.combineMultipleReducers.apply(void 0, reducers) : reducers;
        middlewares.forEach(function (middleware) { return middleware && middleware.init && middleware.init(_this); });
    }
    Object.defineProperty(Dynadux.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Dynadux.prototype.setSectionInitialState = function (section, sectionState) {
        this._state[section] = sectionState;
    };
    return Dynadux;
}());
exports.Dynadux = Dynadux;
//# sourceMappingURL=Dynadux.js.map