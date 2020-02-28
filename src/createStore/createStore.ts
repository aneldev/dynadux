import {
  Dynadux,
  IDynaduxConfig,
  TDynaduxDispatch,
} from "../Dynadux/Dynadux";

export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}

export interface ICreateStoreAPI<TState> {
  dispatch: TDynaduxDispatch;
  state: TState;
}

export const createStore = <TState>(config: ICreateStoreConfig<TState>): ICreateStoreAPI<TState> => {
  const dynadux = new Dynadux<TState>(config);

  return {
    dispatch: dynadux.dispatch,
    get state() { return  dynadux.state; },
  };
};

