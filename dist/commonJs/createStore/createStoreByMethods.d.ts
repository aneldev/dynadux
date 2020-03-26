import { TDynaduxDispatch, IDynaduxMiddleware, TDynaduxMethodReducer } from "../Dynadux/Dynadux";
export interface ICreateStoreByMethodsConfig<TState> {
    initialState: TState;
    middlewares?: IDynaduxMiddleware<any, any>[];
    onDispatch?: (action: string, payload: any) => void;
    onChange?: (state: TState) => void;
}
export declare type TStoreMethod = <TState, TPayload>(params: {
    action: string;
    payload: TPayload;
    dispatch: TDynaduxDispatch<TPayload>;
    state: TState;
}) => undefined | void | Partial<TState>;
export declare const createStoreByMethods: <TState>(config: ICreateStoreByMethodsConfig<TState>) => {
    dispatchMethod: (action: string, method: TDynaduxMethodReducer<TState>) => void;
    readonly state: TState;
};
