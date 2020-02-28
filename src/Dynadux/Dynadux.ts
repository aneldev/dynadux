export interface IDynaduxConfig<TState> {
  initialState?: TState;
  reducers: {
    [actionName: string]: TDynaduxReducer<TState, any>;
  };
  middlewares?: IDynaduxMiddleware<any, any>[];
  onChange?: (state: TState) => void;
}

export type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;

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
  before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => Partial<TState>;
  after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => Partial<TState>;
}

export class Dynadux<TState> {
  private _state: TState;

  constructor(private readonly _config: IDynaduxConfig<TState>) {
    this._state = _config.initialState || {} as any;
  }

  public get state(): TState {
    return this._state;
  }

  public dispatch = <TPayload>(action: string, payload: TPayload): void => {
    const reducer = this._config.reducers[action];
    if (!reducer) {
      console.error(`Reducer not found for action "${action}"`);
      return;
    }

    let initialState = this._state;
    let newState = {...this._state};

    const {middlewares = []} = this._config;

    middlewares.forEach(({before}) => {
      if (!before) return;
      newState = {
        ...newState,
        ...before({
          action,
          payload,
          dispatch: this.dispatch,
          state: newState,
        })
      };
    });

    newState = {
      ...this._state,
      ...reducer({
        action,
        payload,
        dispatch: this.dispatch,
        state: newState,
      }),
    };

    middlewares.forEach(({after}) => {
      if (!after) return;
      newState = {
        ...newState,
        ...after({
          action,
          payload,
          dispatch: this.dispatch,
          state: newState,
          initialState,
        })
      };
    });

    this._state = newState;

    if (this._config.onChange) this._config.onChange(this._state);
  }
}
