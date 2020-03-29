import { IDynaduxConfig, TDynaduxDispatch, IDynaduxReducerDic } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState = any> {
    state: TState;
    dispatch: TDynaduxDispatch;
    createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;
}
export interface ICreateSectionConfig<TSectionState> {
    section: string;
    initialState: TSectionState;
    reducers: IDynaduxReducerDic<TSectionState>;
}
export interface ICreateSectionAPI<TState, TSectionState> {
    storeState: TState;
    state: TSectionState;
    dispatch: TDynaduxDispatch;
}
export declare const createStore: <TState = any>(config: ICreateStoreConfig<TState>) => ICreateStoreAPI<TState>;
