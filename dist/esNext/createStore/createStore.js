import { Dynadux, } from "../Dynadux/Dynadux";
export var createStore = function (config) {
    var dynadux = new Dynadux(config);
    return {
        dispatch: dynadux.dispatch,
        getState: dynadux.getState,
    };
};
//# sourceMappingURL=createStore.js.map