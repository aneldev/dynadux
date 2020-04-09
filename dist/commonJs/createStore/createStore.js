"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynadux_1 = require("../Dynadux/Dynadux");
var convertReducersToSectionReducers_1 = require("./convertReducersToSectionReducers");
var EventEmitter_1 = require("../tools/EventEmitter");
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
            var section = createSectionConfig.section, initialState = createSectionConfig.initialState, reducers = createSectionConfig.reducers, onChange = createSectionConfig.onChange;
            var sectionActions = Object.keys(reducers);
            var sectionChangeEventEmitter = new EventEmitter_1.EventEmitter();
            var dynaduxOnChange = dynadux._onChange;
            dynadux._onChange = function (state, action, payload) {
                if (sectionActions.includes(action)) {
                    sectionChangeEventEmitter.trigger(state, action, payload);
                    onChange && onChange(state[section], action, payload);
                }
                dynaduxOnChange(state, action, payload);
            };
            if (dynadux.state[section])
                throw new Error("dynadux: createSection: Section or root property \"" + section + "\" already exists, section couldn't be created.");
            dynadux.setSectionInitialState(section, initialState);
            dynadux.addReducers(convertReducersToSectionReducers_1.convertReducersToSectionReducers(section, reducers));
            return {
                get storeState() {
                    return dynadux.state;
                },
                get state() {
                    return dynadux.state[section];
                },
                dispatch: dynadux.dispatch,
                addChangeEventListener: function (cb) { return sectionChangeEventEmitter.addEventListener(cb); },
                removeChangeEventListener: function (cb) { return sectionChangeEventEmitter.removeEventListener(cb); },
            };
        }
    };
};
//# sourceMappingURL=createStore.js.map