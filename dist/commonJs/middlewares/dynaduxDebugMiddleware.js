"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../tools/global");
var EDynaduxDebugMiddlewareActions;
(function (EDynaduxDebugMiddlewareActions) {
    EDynaduxDebugMiddlewareActions["SET_STATE"] = "__EDynaduxDebugMiddlewareActions__SET_STATE";
})(EDynaduxDebugMiddlewareActions || (EDynaduxDebugMiddlewareActions = {}));
exports.dynaduxDebugMiddleware = function (config) {
    var _a = config.debuggerStoreName, debuggerStoreName = _a === void 0 ? '' : _a, _b = config.consoleDispatch, consoleDispatch = _b === void 0 ? true : _b, _c = config.consolePayload, consolePayload = _c === void 0 ? false : _c, _d = config.consoleState, consoleState = _d === void 0 ? false : _d, _e = config.consoleMethod, consoleMethod = _e === void 0 ? 'debug' : _e, _f = config.consoleFilter, consoleFilter = _f === void 0 ? function () { return true; } : _f;
    if (!debuggerStoreName)
        return {}; // Exit, it is disabled.
    var lastDispatch = 0;
    var dispatch;
    var activeIndex = 0;
    var dynaduxDebugger = global_1.global[debuggerStoreName] = {
        log: [],
        dispatch: function (action, payload) { return dispatch(action, payload); },
        get list() {
            return dynaduxDebugger.log.map(function (log) { return log.description; }).forEach(function (t) { return console.log(t); });
        },
        get listPayloads() {
            return dynaduxDebugger.log.map(function (log) { return [log.description, log.payload]; }).forEach(function (t) { return console.log.apply(console, t); });
        },
        search: function (text) {
            var textLowerCase = text.toLowerCase();
            return dynaduxDebugger.log.filter(function (item) { return item.description.toLowerCase().indexOf(textLowerCase) > -1; });
        },
        set: function (userDispatchIndex) {
            if (userDispatchIndex === -1) {
                console.error('Nothing is dispatched yet');
                return;
            }
            var logItem = dynaduxDebugger.log[userDispatchIndex];
            if (!logItem) {
                console.error("Item " + userDispatchIndex + " cannot be found");
                return;
            }
            dispatch(EDynaduxDebugMiddlewareActions.SET_STATE, logItem.after);
        },
        prev: function () {
            activeIndex--;
            if (activeIndex < 0)
                activeIndex = 0;
            dynaduxDebugger.set(activeIndex);
        },
        next: function () {
            activeIndex++;
            if (activeIndex + 1 > dynaduxDebugger.log.length)
                activeIndex = dynaduxDebugger.log.length - 1;
            dynaduxDebugger.set(activeIndex);
        },
        now: function () {
            activeIndex = dynaduxDebugger.log.length - 1;
            dynaduxDebugger.set(activeIndex);
        },
        get state() {
            return dynaduxDebugger.log[activeIndex].after;
        }
    };
    var middleware = {
        init: function (store) {
            dispatch = store.dispatch;
            // @ts-ignore
            middleware.after({
                action: 'INFO DynaduxDebugMiddleware Initial State',
                initialState: {},
                state: store.state,
                payload: {
                    debugInfo: 'This is not a real dispatch, it is a log info of DynaduxDebugMiddleware.',
                    debugTag: 2487602415245
                },
                dispatch: store.dispatch,
            });
        },
        before: function (_a) {
            var action = _a.action;
            if (action === EDynaduxDebugMiddlewareActions.SET_STATE)
                return;
            // If the developer travels in past, return him now
            if (activeIndex + 1 < dynaduxDebugger.log.length) {
                activeIndex = dynaduxDebugger.log.length - 1;
                return dynaduxDebugger.log[activeIndex].after;
            }
        },
        after: function (_a) {
            var action = _a.action, payload = _a.payload, initialState = _a.initialState, state = _a.state, reducerElapsedMs = _a.reducerElapsedMs, changed = _a.changed;
            if (action === EDynaduxDebugMiddlewareActions.SET_STATE)
                return payload;
            var now = new Date;
            var nextIndex = dynaduxDebugger.log.length;
            activeIndex = nextIndex;
            var afterMs = (function () {
                if (lastDispatch === 0)
                    return undefined;
                return now.valueOf() - lastDispatch;
            })();
            var logItem = {
                description: [
                    frontSpace(' ', "#" + nextIndex, 5),
                    frontSpace(' ', "+" + duration(afterMs), 10),
                    frontSpace(' ', duration(reducerElapsedMs), 6),
                    frontSpace(' ', now.toLocaleTimeString() + "." + frontSpace('0', now.getMilliseconds(), 4), 13),
                    action,
                ].join(' '),
                action: action,
                afterMs: afterMs,
                payload: payload,
                before: initialState,
                after: state,
                date: now,
                changed: changed,
            };
            dynaduxDebugger.log.push(logItem);
            lastDispatch = now.valueOf();
            if (consoleDispatch
                && (!payload || payload.debugTag !== 2487602415245)
                && consoleFilter(action, payload)) {
                console[consoleMethod].apply(console, ([
                    [
                        debuggerStoreName,
                        frontSpace(' ', "#" + nextIndex, 5),
                        frontSpace(' ', "+" + duration(afterMs), 10),
                        frontSpace(' ', duration(reducerElapsedMs), 6),
                        frontSpace(' ', now.toLocaleTimeString() + "." + frontSpace('0', now.getMilliseconds(), 4), 13),
                        action,
                    ].filter(Boolean).join(' '),
                    consolePayload && 'Payload',
                    consolePayload && payload,
                    consoleState && {
                        before: initialState,
                        after: state,
                        changed: changed,
                    }
                ].filter(Boolean)));
            }
        },
    };
    return middleware;
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