"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynadux_1 = require("../Dynadux/Dynadux");
var EventEmitter_1 = require("../tools/EventEmitter");
var createSection_1 = require("./createSection");
exports.createStore = function (config) {
    var dynadux = new Dynadux_1.Dynadux(config);
    var storeChangeEventEmitter = new EventEmitter_1.EventEmitter();
    var dynaduxOnChange = dynadux._onChange;
    dynadux._onChange = (function (state, action, payload) {
        storeChangeEventEmitter.trigger(state, action, payload);
        dynaduxOnChange(state, action, payload);
    });
    return {
        get state() {
            return dynadux.state;
        },
        dispatch: dynadux.dispatch,
        addChangeEventListener: function (cb) { return storeChangeEventEmitter.addEventListener(cb); },
        removeChangeEventListener: function (cb) { return storeChangeEventEmitter.removeEventListener(cb); },
        provider: {
            addChangeEventListener: function (cb) { return storeChangeEventEmitter.addEventListener(cb); },
            removeChangeEventListener: function (cb) { return storeChangeEventEmitter.removeEventListener(cb); },
        },
        createSection: function (createSectionConfig) {
            return createSection_1.createSection({
                dynadux: dynadux,
                createSectionConfig: createSectionConfig,
            });
        }
    };
};
//# sourceMappingURL=createStore.js.map