import {IDynaduxMiddleware} from "../Dynadux/Dynadux";

export const dynaduxDebugMiddleware = (): IDynaduxMiddleware => {
  let global: any;
  if (typeof window !== 'undefined') global = window;
  if (!global && typeof process !== 'undefined') global = process;

  let lastDispatch = 0;
  let dispatchNo = 0;
  global.dynaduxDebugMiddleware = [];

  return {
    after: (
      {
        action,
        payload,
        initialState,
        state,
      }
    ) => {
      const date = new Date;
      dispatchNo++;

      global.dynaduxDebugMiddleware.push({
        desc: `#${(dispatchNo)} ${action} ${date.toTimeString()}`,
        action,
        afterMs: (() => {
          if (lastDispatch === 0) return undefined;
          return date.valueOf() - lastDispatch;
        })(),
        payload,
        before: initialState,
        after: state,
      });

      lastDispatch = date.valueOf();
      return state;
    },
  };
};
