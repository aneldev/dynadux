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
        this._dispatch = function () {
            if (_this._isDispatching)
                return;
            _this._isDispatching = true;
            var dispatchItem = _this._dispatches.shift();
            if (!dispatchItem) {
                _this._isDispatching = false;
                return;
            }
            var action = dispatchItem.action, payload = dispatchItem.payload;
            var reducer = _this._config.reducers[action];
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
            if (reducer)
                newState = __assign(__assign({}, _this._state), (reducer({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                }) || {}));
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
                }) || {}));
            });
            _this._state = newState;
            if (_this._config.onChange)
                _this._config.onChange(_this._state);
            _this._isDispatching = false;
            _this._dispatch();
        };
        this._state = _config.initialState || {};
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
export { Dynadux };
//# sourceMappingURL=Dynadux.js.map