import { IDynaduxConfig, TDynaduxDispatch } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState = any> {
    dispatch: TDynaduxDispatch;
    state: TState;
}
export declare const createStore: <TState = any>(config: ICreateStoreConfig<TState>) => ICreateStoreAPI<TState>;
