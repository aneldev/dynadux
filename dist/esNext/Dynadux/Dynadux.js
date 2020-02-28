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
        this.getState = function () {
            return _this._state;
        };
        this.dispatch = function (action, payload) {
            var reducer = _this._config.reducers[action];
            if (!reducer) {
                console.error("Reducer not found for action \"" + action + "\"");
                return;
            }
            var initialState = _this._state;
            var newState = __assign({}, _this._state);
            var _a = _this._config.middlewares, middlewares = _a === void 0 ? [] : _a;
            middlewares.forEach(function (_a) {
                var before = _a.before;
                if (!before)
                    return;
                newState = __assign(__assign({}, newState), before({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                }));
            });
            newState = __assign(__assign({}, _this._state), reducer({
                action: action,
                payload: payload,
                dispatch: _this.dispatch,
                state: newState,
            }));
            middlewares.forEach(function (_a) {
                var after = _a.after;
                if (!after)
                    return;
                newState = __assign(__assign({}, newState), after({
                    action: action,
                    payload: payload,
                    dispatch: _this.dispatch,
                    state: newState,
                    initialState: initialState,
                }));
            });
            _this._state = newState;
            _this._pushChanges();
        };
        this._state = _config.initialState || {};
        this._pushChanges();
    }
    Dynadux.prototype._pushChanges = function () {
        if (this._config.onChange)
            this._config.onChange(this._state);
    };
    return Dynadux;
}());
export { Dynadux };
//# sourceMappingURL=Dynadux.js.map