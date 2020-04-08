"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynadux_1 = require("../Dynadux/Dynadux");
var convertReducersToSectionReducers_1 = require("./convertReducersToSectionReducers");
exports.createStore = function (config) {
    var dynadux = new Dynadux_1.Dynadux(config);
    return {
        get state() {
            return dynadux.state;
        },
        dispatch: dynadux.dispatch,
        createSection: function (createSectionConfig) {
            var section = createSectionConfig.section, initialState = createSectionConfig.initialState, reducers = createSectionConfig.reducers, onChange = createSectionConfig.onChange;
            var dynaduxOnChange = dynadux.onChange;
            dynadux.onChange = function (state) {
                onChange && onChange(state[section]);
                dynaduxOnChange(state);
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
            };
        }
    };
};
//# sourceMappingURL=createStore.js.map