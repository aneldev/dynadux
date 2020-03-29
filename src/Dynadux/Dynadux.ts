import {combineMultipleReducers} from "../utils/combineMultipleReducers";

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
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}

export interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}

export interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
  action: string;
  payload: any;
  reducerElapsedMs: number;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
  initialState: TState;
}

export type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;

export interface IDynaduxMiddleware<TState = any, TPayload = any> {
  init?: (store: Dynadux<TState>) => void;
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}

interface IDispatch<TPayload> {
  action: string;
  payload: TPayload;
}

export class Dynadux<TState = any> {
  private _state: TState;
  private readonly _dispatches: IDispatch<any>[] = [];
  private _isDispatching = false;
  private _reducers: IDynaduxReducerDic<TState>;

  constructor(private readonly _config: IDynaduxConfig<TState>) {
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

  public dispatch = <TPayload>(action: string, payload: TPayload): void => {
    this._dispatches.push({action, payload});
    this._dispatch();
  };

  private _dispatch = <TPayload>(): void => {
    if (this._isDispatching) return;
    this._isDispatching = true;

    const dispatchItem = this._dispatches.shift();
    if (!dispatchItem) {
      this._isDispatching = false;
      return;
    }
    const {action, payload} = dispatchItem;
    const reducer = this._reducers[action];

    let initialState = this._state;
    let newState = {...this._state};

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

    if (this._config.onChange) this._config.onChange(this._state);
    if (this._config.onDispatch) this._config.onDispatch(action, payload);

    this._isDispatching = false;
    this._dispatch();
  };
}
