import {Dynadux, IDynaduxMiddleware} from "../Dynadux/Dynadux";
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
  let dispatch: <TPayload>(action: string, payload: TPayload) => void;
  let activeIndex = 0;

  const dynaduxDebugger = global[globalVariableName] = {
    log: [] as IDebugLogItem[],
    dispatch: <TPayload>(action: string, payload?: TPayload): void => dispatch(action, payload),
    get list(): void {
      return dynaduxDebugger.log.map((log: IDebugLogItem) => log.description).forEach(t => console.log(t));
    },
    get listPayloads(): void {
      return dynaduxDebugger.log.map((log: IDebugLogItem) => [log.description, log.payload]).forEach(t => console.log(...t));
    },
    search: (text: string) => {
      const textLowerCase = text.toLowerCase();
      return dynaduxDebugger.log.filter((item: any) => item.description.toLowerCase().indexOf(textLowerCase) > -1);
    },
    set: (userDispatchIndex: number): void => {
      if (userDispatchIndex === -1) {
        console.error('Nothing is dispatched yet');
        return;
      }
      const logItem: IDebugLogItem = dynaduxDebugger.log[userDispatchIndex];
      if (!logItem) {
        console.error(`Item ${userDispatchIndex} cannot be found`);
        return;
      }
      dispatch(EDynaduxDebugMiddlewareActions.SET_STATE, logItem.after);
    },
    prev: (): void => {
      activeIndex--;
      if (activeIndex < 0) activeIndex = 0;
      dynaduxDebugger.set(activeIndex);
    },
    next: (): void => {
      activeIndex++;
      if (activeIndex + 1 > dynaduxDebugger.log.length) activeIndex = dynaduxDebugger.log.length - 1;
      dynaduxDebugger.set(activeIndex);
    },
    now: (): void => {
      activeIndex = dynaduxDebugger.log.length - 1;
      dynaduxDebugger.set(activeIndex);
    },
    get state(): any {
      return dynaduxDebugger.log[activeIndex].after;
    }
  };

  const middleware: IDynaduxMiddleware = {
    init: (store: Dynadux) => {
      dispatch = store.dispatch;
      // @ts-ignore
      middleware.after({
        action: 'INFO DynaduxDebugMiddleware Initial State',
        initialState: {},
        state: store.state,
        payload: {debugInfo: 'This is not a real dispatch, it is a log info of DynaduxDebugMiddleware.'},
        dispatch: store.dispatch,
      });
    },
    before: ({action}) => {
      if (action === EDynaduxDebugMiddlewareActions.SET_STATE) return;

      // If the developer travels in past, return him now
      if (activeIndex + 1 < dynaduxDebugger.log.length) {
        activeIndex = dynaduxDebugger.log.length - 1;
        return dynaduxDebugger.log[activeIndex].after;
      }
    },
    after: ({action, payload, initialState, state, reducerElapsedMs}) => {
      if (action === EDynaduxDebugMiddlewareActions.SET_STATE) return payload;

      const now = new Date;
      const nextIndex = dynaduxDebugger.log.length;
      activeIndex = nextIndex;

      const afterMs = (() => {
        if (lastDispatch === 0) return undefined;
        return now.valueOf() - lastDispatch;
      })();

      dynaduxDebugger.log.push({
        description:
          [
            frontSpace(' ', `#${nextIndex}`, 5),
            frontSpace(' ', `+${duration(afterMs)}`, 10),
            frontSpace(' ', duration(reducerElapsedMs), 4),
            frontSpace(' ', `${now.toLocaleTimeString()}.${frontSpace('0', now.getMilliseconds(), 4)}`, 13),
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

  return middleware;
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
