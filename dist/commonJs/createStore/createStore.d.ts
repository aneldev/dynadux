import { IDynaduxConfig, TDynaduxReducerDispatch, IDynaduxReducerDic } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState = any> {
    state: TState;
    dispatch: TDynaduxReducerDispatch;
    createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;
}
export interface ICreateSectionConfig<TSectionState> {
    section: string;
    initialState: TSectionState;
    reducers: IDynaduxReducerDic<TSectionState>;
    onChange?: (sectionState: TSectionState, action: string, payload?: any) => void;
}
export interface ICreateSectionAPI<TState, TSectionState> {
    storeState: TState;
    state: TSectionState;
    dispatch: TDynaduxReducerDispatch;
}
export declare const createStore: <TState = any>(config?: ICreateStoreConfig<TState> | undefined) => ICreateStoreAPI<TState>;
