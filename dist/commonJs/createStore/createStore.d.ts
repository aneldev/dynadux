import { IDynaduxConfig, TDynaduxReducerDispatch, IDynaduxReducerDic } from "../Dynadux/Dynadux";
export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}
export interface ICreateStoreAPI<TState = any> {
    state: TState;
    dispatch: TDynaduxReducerDispatch;
    createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;
    addChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
    removeChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
    provider: IStoreProviderAPI<TState>;
}
export interface IStoreProviderAPI<TState> {
    addChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
    removeChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
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
    addChangeEventListener: (cb: (sectionState: TSectionState, action: string, payload?: any) => void) => void;
    removeChangeEventListener: (cb: (sectionState: TSectionState, action: string, payload?: any) => void) => void;
}
export declare const createStore: <TState = any>(config?: ICreateStoreConfig<TState> | undefined) => ICreateStoreAPI<TState>;
