import {
  Dynadux,
  IDynaduxConfig,
  TDynaduxDispatch,
  TDynaduxMethodReducer,
} from "../Dynadux/Dynadux";

export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}

export interface ICreateStoreAPI<TState = any> {
  state: TState;
  dispatch: TDynaduxDispatch;
  dispatchMethod: (action: string, method: TDynaduxMethodReducer<TState>) => void;
}

export const createStore = <TState = any>(config: ICreateStoreConfig<TState>): ICreateStoreAPI<TState> => {
  const dynadux = new Dynadux<TState>(config);

  return {
    dispatch: dynadux.dispatch,
    dispatchMethod: dynadux.dispatchMethod,
    get state() { return  dynadux.state; },
  };
};

