export interface IDynaduxConfig<TState> {
  initialState?: TState;
  reducers: {
    [actionName: string]: TDynaduxReducer<TState, any>;
  };
  middlewares?: IDynaduxMiddleware<any, any>[];
  onChange?: (state: TState) => void;
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
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
  initialState: TState;
}

export type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;

export interface IDynaduxMiddleware<TState = void, TPayload = void> {
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}

interface IDispatch<TPayload> {
  action: string;
  payload: TPayload;
}

export class Dynadux<TState> {
  private _state: TState;
  private readonly _dispatches: IDispatch<any>[] = [];
  private _isDispatching = false;

  constructor(private readonly _config: IDynaduxConfig<TState>) {
    this._state = _config.initialState || {} as any;
  }

  public get state(): TState {
    return this._state;
  }

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
    const reducer = this._config.reducers[action];

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

    if (reducer) newState = {
      ...this._state,
      ...(reducer({
        action,
        payload,
        dispatch: this.dispatch,
        state: newState,
      }) || {}),
    };

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
        }) || {})
      };
    });

    this._state = newState;

    if (this._config.onChange) this._config.onChange(this._state);

    this._isDispatching = false;
    this._dispatch();
  }
}
