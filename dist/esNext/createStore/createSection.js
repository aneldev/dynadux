import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";
import { EventEmitter } from "../tools/EventEmitter";
export var createSection = function (_a) {
    var dynadux = _a.dynadux, createSectionConfig = _a.createSectionConfig;
    var section = createSectionConfig.section, initialState = createSectionConfig.initialState, reducers = createSectionConfig.reducers, onChange = createSectionConfig.onChange;
    var sectionActions = Object.keys(reducers);
    var sectionChangeEventEmitter = new EventEmitter();
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
    dynadux.addReducers(convertReducersToSectionReducers(section, reducers));
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
};
//# sourceMappingURL=createSection.js.map