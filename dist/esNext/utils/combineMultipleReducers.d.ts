import { IDynaduxReducerDic } from "../Dynadux/Dynadux";
export declare const combineMultipleReducers: <TState>(...reducerDics: IDynaduxReducerDic<TState>[]) => IDynaduxReducerDic<TState>;
