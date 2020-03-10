"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../tools/global");
var EDynaduxDebugMiddlewareActions;
(function (EDynaduxDebugMiddlewareActions) {
    EDynaduxDebugMiddlewareActions["SET_STATE"] = "__EDynaduxDebugMiddlewareActions__SET_STATE";
})(EDynaduxDebugMiddlewareActions || (EDynaduxDebugMiddlewareActions = {}));
exports.dynaduxDebugMiddleware = function (_a) {
    var _b = (_a === void 0 ? {} : _a).globalVariableName, globalVariableName = _b === void 0 ? 'dynaduxDebugMiddleware' : _b;
    var lastDispatch = 0;
    var dispatchIndex = -1;
    var g = global_1.global[globalVariableName] = {
        log: [],
        get list() {
            return g.log.map(function (log) { return log.desc; }).forEach(function (t) { return console.log(t); });
        },
        search: function (text) {
            var textLowerCase = text.toLowerCase();
            return g.log.filter(function (item) { return item.desc.toLowerCase().indexOf(textLowerCase) > -1; });
        },
        set: function (dispatchIndex) {
            if (!dispatchIndex) {
                console.error('Nothing is dispatched yet');
                return;
            }
            var logItem = g.log[dispatchIndex];
            if (!logItem) {
                console.error("Item " + dispatchIndex + " cannot be found");
                return;
            }
            dispatch(EDynaduxDebugMiddlewareActions.SET_STATE, logItem.after);
        }
    };
    var dispatch;
    return {
        after: function (_a) {
            var action = _a.action, payload = _a.payload, initialState = _a.initialState, state = _a.state, d_ = _a.dispatch;
            if (action === EDynaduxDebugMiddlewareActions.SET_STATE) {
                return payload;
            }
            dispatch = d_;
            var date = new Date;
            dispatchIndex++;
            var afterMs = (function () {
                if (lastDispatch === 0)
                    return undefined;
                return date.valueOf() - lastDispatch;
            })();
            global_1.global[globalVariableName].log.push({
                desc: [
                    frontSpace(' ', '#' + dispatchIndex, 5),
                    frontSpace(' ', "+" + duration(afterMs), 12),
                    action,
                    date.toTimeString()
                ].join(' '),
                action: action,
                afterMs: afterMs,
                payload: payload,
                before: initialState,
                after: state,
            });
            lastDispatch = date.valueOf();
        },
    };
};
var frontSpace = function (spacer, content, length) {
    var text = String(content);
    if (text.length >= length)
        return text;
    return ("" + Array(length).fill(spacer).join('') + text).substr(-length);
};
var duration = function (d) {
    if (d === void 0) { d = 0; }
    if (d > 10000)
        return (d / 1000).toFixed(2) + 'sec';
    return d + 'ms';
};
//# sourceMappingURL=dynaduxDebugMiddleware.js.map