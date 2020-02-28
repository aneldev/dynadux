import { Dynadux, } from "../Dynadux/Dynadux";
export var createStore = function (config) {
    var dynadux = new Dynadux(config);
    return {
        dispatch: dynadux.dispatch,
        get state() { return dynadux.state; },
    };
};
//# sourceMappingURL=createStore.js.map