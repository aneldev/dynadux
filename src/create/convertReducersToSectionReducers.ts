import {
  IDynaduxReducerDic,
  IDynaduxReducerAPI
} from "../Dynadux/Dynadux";

export const convertReducersToSectionReducers = (section: string, sectionReducers: IDynaduxReducerDic<any>): IDynaduxReducerDic<any> => {
  return Object.keys(sectionReducers)
    .reduce((acc: IDynaduxReducerDic<any>, action: string) => {
      const originalReducer = sectionReducers[action];

      acc[action] = (params: IDynaduxReducerAPI<any, any>): undefined | void | Partial<any> => {
        const subPartialState = originalReducer({
          ...params,
          state: params.state[section],
        });

        if (subPartialState) return {
          ...params.state,
          [section]: {
            ...params.state[section],
            ...subPartialState
          },
        } as any;
      };

      return acc;
    }, {});
};
