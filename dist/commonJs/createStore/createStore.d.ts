import { IDynaduxConfig, TDynaduxDispatch, TDynaduxMethodReducer } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState = any> {
    state: TState;
    dispatch: TDynaduxDispatch;
    dispatchMethod: (action: string, method: TDynaduxMethodReducer<TState>) => void;
}
export declare const createStore: <TState = any>(config: ICreateStoreConfig<TState>) => ICreateStoreAPI<TState>;
