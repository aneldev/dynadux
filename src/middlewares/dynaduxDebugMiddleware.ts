import {IDynaduxMiddleware} from "../Dynadux/Dynadux";
import {global} from "../tools/global";

export interface IDynaduxDebugMiddlewareConfig {
  globalVariableName?: string;
}

export interface IDebugLogItem {
  description: string;
  action: string;
  payload: any;
  afterMs: number;
  before: any;
  after: any;
  date: Date;
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
  const dynaduxDebugger = global[globalVariableName] = {
    log: [],
    get list(): void {
      return dynaduxDebugger.log.map((log: IDebugLogItem) => log.description).forEach(t => console.log(t));
    },
    search: (text: string) => {
      const textLowerCase = text.toLowerCase();
      return dynaduxDebugger.log.filter((item: any) => item.description.toLowerCase().indexOf(textLowerCase) > -1);
    },
    set: (dispatchIndex: number): void => {
      if (dispatchIndex === -1) {
        console.error('Nothing is dispatched yet');
        return;
      }
      const logItem: IDebugLogItem = dynaduxDebugger.log[dispatchIndex];
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
      const now = new Date;
      dispatchIndex++;

      const afterMs = (() => {
        if (lastDispatch === 0) return undefined;
        return now.valueOf() - lastDispatch;
      })();

      global[globalVariableName].log.push({
        description:
          [
            frontSpace(' ', '#' + dispatchIndex, 5),
            frontSpace(' ', `+${duration(afterMs)}`, 12),
            frontSpace(' ', `${now.toLocaleTimeString()}.${frontSpace('0', now.getMilliseconds(), 4)}`, 15),
            action,
          ].join(' '),
        action,
        afterMs,
        payload,
        before: initialState,
        after: state,
        date: now,
      } as IDebugLogItem);

      lastDispatch = now.valueOf();
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
