import {IDynaduxMiddleware} from "../Dynadux/Dynadux";
import {global}  from "../tools/global";

export interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}

export const dynaduxDebugMiddleware = (
  {
    globalVariableName = 'dynaduxDebugMiddleware',
  }: IDynaduxDebugMiddlewareConfig = {}
): IDynaduxMiddleware => {
  let lastDispatch = 0;
  let dispatchNo = 0;
  global[globalVariableName] = [];

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

      const afterMs = (() => {
        if (lastDispatch === 0) return undefined;
        return date.valueOf() - lastDispatch;
      })();

      global[globalVariableName].push({
        desc:
          [
            frontSpace(' ', '#' + dispatchNo, 5),
            frontSpace(' ', `+${duration(afterMs)}`, 9),
            action,
            date.toTimeString()
          ].join(' '),
        action,
        afterMs,
        payload,
        before: initialState,
        after: state,
      });

      lastDispatch = date.valueOf();
      return state;
    },
  };
};

const frontSpace = (spacer: string, content: string | number, length: number): string => {
  const text = String(content);
  if (text.length >= length) return text;
  return `${Array(length).fill(spacer).join('')}${text}`.substr(-length);
};

const duration = (d: number = 0): string => {
  if (d > 10000) return (d / 1000).toFixed(2) + 'sec';
  return d + 'ms';
};
