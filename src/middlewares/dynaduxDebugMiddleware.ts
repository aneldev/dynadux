import {IDynaduxMiddleware} from "../Dynadux/Dynadux";

export const dynaduxDebugMiddleware: IDynaduxMiddleware = {
  before: ({state}) => {
    return state;
  },
  after: ({state, initialState}) => {
    return state;
  },
};
