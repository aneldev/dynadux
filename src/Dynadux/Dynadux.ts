import {combineMultipleReducers} from "../utils/combineMultipleReducers";
import { consoledOnce } from "../utils/consoleOnce";

export interface IDynaduxConfig<TState> {
  initialState?: TState;
  reducers?: IDynaduxReducerDic<TState> | IDynaduxReducerDic<TState>[];
  middlewares?: IDynaduxMiddleware<any, any>[];
  onDispatch?: (action: string, payload: any) => void;
  onChange?: (state: TState) => void;
}

export interface IDynaduxReducerDic<TState> {
  [action: string]: TDynaduxReducer<TState, any>;
}

export type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => undefined | void | Partial<TState>;

export interface IDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxReducerDispatch<TPayload>;
  state: TState;
  blockChange: () => void;
}

export interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxMiddlewareDispatch<TPayload>;
  state: TState;
}

export interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
  action: string;
  payload: any;
  reducerElapsedMs: number;
  dispatch: TDynaduxMiddlewareDispatch<TPayload>;
  state: TState;
  initialState: TState;
}

export type TDynaduxReducerDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload, dispatchConfig?: IDispatchConfig) => void;
export type TDynaduxMiddlewareDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;

export interface IDynaduxMiddleware<TState = any, TPayload = any> {
  init?: (store: Dynadux<TState>) => void;
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}

interface IDispatch<TPayload> {
  action: string;
  payload: TPayload;
  dispatchConfig: IDispatchConfig;
}

interface IDispatchConfig {
  blockChange?: boolean;      // default: false
  triggerChange?: boolean;    // default: true DEPRECATED, use the blockChange instead.
}

export class Dynadux<TState = any> {
  private _state: TState;
  private readonly _dispatches: IDispatch<any>[] = [];
  private _isDispatching = false;
  private _reducers: IDynaduxReducerDic<TState>;

  constructor(private readonly _config: IDynaduxConfig<TState> = {}) {
    const {
      initialState = {},
      reducers = {},
      middlewares = [],
    } = this._config;

    this._state = initialState as any;

    this._reducers =
      Array.isArray(reducers)
        ? combineMultipleReducers(...reducers)
        : reducers;

    middlewares.forEach(middleware => middleware.init && middleware.init(this));
  }

  public get state(): TState {
    return this._state;
  }

  public setSectionInitialState(section: string, sectionState: any): void {
    this._state[section] = sectionState;
  }

  public addReducers = (reducers: IDynaduxReducerDic<TState>): void => {
    this._reducers = combineMultipleReducers(this._reducers, reducers);
  };

  public dispatch = <TPayload>(action: string, payload: TPayload, dispatchConfig: IDispatchConfig = {}): void => {
    this._dispatches.push({action, payload, dispatchConfig});
    this._dispatch();
  };

  public _onChange = (state: TState, action: string, payload: any): void => undefined;

  private _dispatch = <TPayload>(): void => {
    if (this._isDispatching) return;
    this._isDispatching = true;

    const dispatchItem = this._dispatches.shift();
    if (!dispatchItem) {
      this._isDispatching = false;
      return;
    }

    if (typeof dispatchItem.dispatchConfig.triggerChange !== "undefined") consoledOnce('warn', 'Dynadux: `triggerChange` config prop is deprecated and will be not accepted on next major version. Use the `blockChange` (with the opposite logic) instead.');

    const {
      action,
      payload,
      dispatchConfig: {
        blockChange: userBlockChange = false,
        triggerChange = true,
      },
    } = dispatchItem;
    const reducer = this._reducers[action];

    let initialState = this._state;
    let newState = {...this._state};
    let blockChange = userBlockChange || !triggerChange;

    const {middlewares = []} = this._config;

    middlewares.forEach(({before}) => {
      if (!before) return;
      newState = {
        ...newState,
        ...(before({
          action,
          payload,
          dispatch: this.dispatch,
          state: newState,
        }) || {})
      };
    });

    const reducerStart = Date.now();
    if (reducer) newState = {
      ...this._state,
      ...(reducer({
        action,
        payload,
        dispatch: this.dispatch,
        state: newState,
        blockChange: () => blockChange = true,
      }) || {}),
    };
    const reducerElapsedMs = Date.now() - reducerStart;

    middlewares.forEach(({after}) => {
      if (!after) return;
      newState = {
        ...newState,
        ...(after({
          action,
          payload,
          dispatch: this.dispatch,
          state: newState,
          initialState,
          reducerElapsedMs,
        }) || {})
      };
    });

    this._state = newState;

    if (this._config.onChange && !blockChange) {
      this._config.onChange(this._state);
      this._onChange(this._state, action, payload);
    }
    if (this._config.onDispatch) this._config.onDispatch(action, payload);

    this._isDispatching = false;
    this._dispatch();
  };
}
