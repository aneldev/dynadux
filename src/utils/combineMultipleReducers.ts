import {IDynaduxReducerDic} from "../Dynadux/Dynadux";


export const combineMultipleReducers = <TState>(...reducerDics: Array<IDynaduxReducerDic<TState>>): IDynaduxReducerDic<TState> => {
  const output: IDynaduxReducerDic<TState> = {};

  reducerDics
    .forEach(reducerDic => {
      Object.keys(reducerDic)
        .forEach(action => {
          if (!output[action]) {
            output[action] = reducerDic[action];
          }
          else {
            const originalReducer = output[action];
            output[action] = (params) => {
              const stateA = params.state || {};
              const stateB = originalReducer({...params, state: stateA as any});
              return reducerDic[action]({...params, state: stateB as any});
            };
          }
        });
    });

  return output;
};