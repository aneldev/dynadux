import { global } from "../tools/global";
export var dynaduxDebugMiddleware = function (_a) {
    var _b = (_a === void 0 ? {} : _a).globalVariableName, globalVariableName = _b === void 0 ? 'dynaduxDebugMiddleware' : _b;
    var lastDispatch = 0;
    var dispatchNo = 0;
    global[globalVariableName] = [];
    return {
        after: function (_a) {
            var action = _a.action, payload = _a.payload, initialState = _a.initialState, state = _a.state;
            var date = new Date;
            dispatchNo++;
            var afterMs = (function () {
                if (lastDispatch === 0)
                    return undefined;
                return date.valueOf() - lastDispatch;
            })();
            global[globalVariableName].push({
                desc: [
                    frontSpace(' ', '#' + dispatchNo, 5),
                    frontSpace(' ', "+" + duration(afterMs), 9),
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
            return state;
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