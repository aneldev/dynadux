"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynaduxDebugMiddleware = function () {
    var global;
    if (typeof window !== 'undefined')
        global = window;
    if (!global && typeof process !== 'undefined')
        global = process;
    var lastDispatch = 0;
    var dispatchNo = 0;
    global.dynaduxDebugMiddleware = [];
    return {
        after: function (_a) {
            var action = _a.action, payload = _a.payload, initialState = _a.initialState, state = _a.state;
            var date = new Date;
            dispatchNo++;
            global.dynaduxDebugMiddleware.push({
                desc: "#" + (dispatchNo) + " " + action + " " + date.toTimeString(),
                action: action,
                afterMs: (function () {
                    if (lastDispatch === 0)
                        return undefined;
                    return date.valueOf() - lastDispatch;
                })(),
                payload: payload,
                before: initialState,
                after: state,
            });
            lastDispatch = date.valueOf();
            return state;
        },
    };
};
//# sourceMappingURL=dynaduxDebugMiddleware.js.map