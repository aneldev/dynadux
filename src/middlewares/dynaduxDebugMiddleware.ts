import {IDynaduxMiddleware} from "../Dynadux/Dynadux";
import {global} from "../tools/global";

export interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}

export interface IDebugLogItem {
  desc: string;
  action: string;
  payload: any;
  afterMs: number;
  before: any;
  after: any;
}

enum EDynaduxDebugMiddlewareActions {
  SET_STATE = '__EDynaduxDebugMiddlewareActions__SET_STATE',
}

export const dynaduxDebugMiddleware = (
  {
    globalVariableName = 'dynaduxDebugMiddleware',
  }: IDynaduxDebugMiddlewareConfig = {}
): IDynaduxMiddleware => {
  let lastDispatch = 0;
  let dispatchIndex = -1;
  const g = global[globalVariableName] = {
    log: [],
    get list(): void {
      return g.log.map((log: IDebugLogItem) => log.desc).forEach(t => console.log(t));
    },
    search: (text: string) => {
      const textLowerCase = text.toLowerCase();
      return g.log.filter((item: any) => item.desc.toLowerCase().indexOf(textLowerCase) > -1);
    },
    set: (dispatchIndex: number): void => {
      if (dispatchIndex === -1) {
        console.error('Nothing is dispatched yet');
        return;
      }
      const logItem: IDebugLogItem = g.log[dispatchIndex];
      if (!logItem) {
        console.error(`Item ${dispatchIndex} cannot be found`);
        return;
      }
      dispatch(EDynaduxDebugMiddlewareActions.SET_STATE, logItem.after);
    }
  };
  let dispatch: <TPayload>(action: string, payload: TPayload) => void;

  return {
    after: (
      {
        action,
        payload,
        initialState,
        state,
        dispatch: d_,
      }
    ) => {
      if (action === EDynaduxDebugMiddlewareActions.SET_STATE) {
        return payload;
      }

      dispatch = d_;
      const date = new Date;
      dispatchIndex++;

      const afterMs = (() => {
        if (lastDispatch === 0) return undefined;
        return date.valueOf() - lastDispatch;
      })();

      global[globalVariableName].log.push({
        desc:
          [
            frontSpace(' ', '#' + dispatchIndex, 5),
            frontSpace(' ', `+${duration(afterMs)}`, 12),
            action,
            date.toTimeString()
          ].join(' '),
        action,
        afterMs,
        payload,
        before: initialState,
        after: state,
      } as IDebugLogItem);

      lastDispatch = date.valueOf();
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
