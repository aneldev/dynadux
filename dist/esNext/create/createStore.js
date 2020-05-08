import { Dynadux, } from "../Dynadux/Dynadux";
import { EventEmitter } from "../tools/EventEmitter";
import { createSection } from "./createSection";
export var createStore = function (config) {
    var dynadux = new Dynadux(config);
    var storeChangeEventEmitter = new EventEmitter();
    var dynaduxOnChange = dynadux._onChange;
    dynadux._onChange = (function (state, action, payload) {
        storeChangeEventEmitter.trigger(state, action, payload);
        dynaduxOnChange(state, action, payload);
    });
    var store = {
        get state() {
            return dynadux.state;
        },
        dispatch: dynadux.dispatch,
        addChangeEventListener: function (cb) { return storeChangeEventEmitter.addEventListener(cb); },
        removeChangeEventListener: function (cb) { return storeChangeEventEmitter.removeEventListener(cb); },
        provider: {
            get store() {
                return store;
            },
            addChangeEventListener: function (cb) { return storeChangeEventEmitter.addEventListener(cb); },
            removeChangeEventListener: function (cb) { return storeChangeEventEmitter.removeEventListener(cb); },
        },
        createSection: function (createSectionConfig) {
            return createSection({
                dynadux: dynadux,
                createSectionConfig: createSectionConfig,
            });
        }
    };
    return store;
};
//# sourceMappingURL=createStore.js.map