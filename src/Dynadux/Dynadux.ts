export interface IDynaduxConfig<TState> {
  initialState?: TState;
  reducers: {
    [actionName: string]: TDynaduxReducer<TState, any>;
  };
  onChange?: (state: TState) => void;
}

export type TDynaduxReducer<TState, TPayload> = (params: TDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;

export interface TDynaduxReducerAPI<TState, TPayload> {
  action: string;
  payload: any;
  dispatch: TDynaduxDispatch<TPayload>;
  state: TState;
}

export type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void | Promise<void>;

export class Dynadux<TState> {
  private _state: TState;

  constructor(private readonly _config: IDynaduxConfig<TState>) {
    this._state = _config.initialState || {} as any;
    this.getState = this.getState.bind(this);
  }

  public getState(): TState {
    return this._state;
  }

  public dispatch = <TPayload>(action: string, payload: TPayload): void => {
    const reducer = this._config.reducers[action];
    if (!reducer) throw {message: `Reducer not found for action "${action}"`};
    this._state = {
      ...this._state,
      ...reducer({
        action,
        payload,
        dispatch: this.dispatch,
        state: this._state,
      }),
    };
    if (this._config.onChange) this._config.onChange(this.getState());
  }
}
