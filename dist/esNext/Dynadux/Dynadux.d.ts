export interface IDynaduxConfig<TState> {
    initialState?: TState;
    reducers: IDynaduxReducerDic<TState> | IDynaduxReducerDic<TState>[];
    middlewares?: IDynaduxMiddleware<any, any>[];
    onChange?: (state: TState) => void;
}
export interface IDynaduxReducerDic<TState> {
    [action: string]: TDynaduxReducer<TState, any>;
}
export declare type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => undefined | void | Partial<TState>;
export interface IDynaduxReducerAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxDispatch<TPayload>;
    state: TState;
}
export interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxDispatch<TPayload>;
    state: TState;
}
export interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxDispatch<TPayload>;
    state: TState;
    initialState: TState;
}
export declare type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload?: TPayload) => void;
export interface IDynaduxMiddleware<TState = any, TPayload = any> {
    init?: (store: Dynadux<TState>) => void;
    before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
    after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}
export declare class Dynadux<TState = any> {
    private readonly _config;
    private _state;
    private readonly _dispatches;
    private _isDispatching;
    private readonly _reducers;
    constructor(_config: IDynaduxConfig<TState>);
    get state(): TState;
    dispatch: <TPayload>(action: string, payload: TPayload) => void;
    private _dispatch;
}
