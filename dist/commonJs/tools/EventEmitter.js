"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        var _this = this;
        this.callBacks = [];
        this.trigger = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.callBacks.forEach(function (cb) { return cb.apply(void 0, args); });
        };
        this.addEventListener = function (callback) {
            _this.callBacks.push(callback);
        };
        this.removeEventListener = function (callback) {
            _this.callBacks = _this.callBacks.filter(function (c) { return c !== callback; });
        };
    }
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map