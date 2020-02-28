export interface IDynaduxConfig<TState> {
    initialState?: TState;
    reducers: {
        [actionName: string]: TDynaduxReducer<TState, any>;
    };
    middlewares?: IDynaduxMiddleware<any, any>[];
    onChange?: (state: TState) => void;
}
export declare type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;
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
export declare type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void;
export interface IDynaduxMiddleware<TState = void, TPayload = void> {
    before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => Partial<TState>;
    after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => Partial<TState>;
}
export declare class Dynadux<TState> {
    private readonly _config;
    private _state;
    constructor(_config: IDynaduxConfig<TState>);
    getState(): TState;
    dispatch: <TPayload>(action: string, payload: TPayload) => void;
}
