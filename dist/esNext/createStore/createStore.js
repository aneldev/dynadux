import { Dynadux, } from "../Dynadux/Dynadux";
import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";
export var createStore = function (config) {
    var dynadux = new Dynadux(config);
    return {
        get state() {
            return dynadux.state;
        },
        dispatch: dynadux.dispatch,
        createSection: function (createSectionConfig) {
            var section = createSectionConfig.section, initialState = createSectionConfig.initialState, reducers = createSectionConfig.reducers;
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
            };
        }
    };
};
//# sourceMappingURL=createStore.js.map