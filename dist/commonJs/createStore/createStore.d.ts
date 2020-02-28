import { IDynaduxConfig, TDynaduxDispatch } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState> {
    dispatch: TDynaduxDispatch;
    state: TState;
}
export declare const createStore: <TState>(config: ICreateStoreConfig<TState>) => ICreateStoreAPI<TState>;
