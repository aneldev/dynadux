export interface IDynaduxConfig<TState> {
    initialState?: TState;
    reducers?: IDynaduxReducerDic<TState> | IDynaduxReducerDic<TState>[];
    middlewares?: IDynaduxMiddleware<any, any>[];
    onDispatch?: (action: string, payload: any) => void;
    onChange?: (state: TState, action: string, payload?: any) => void;
}
export interface IDynaduxReducerDic<TState> {
    [action: string]: TDynaduxReducer<TState, any>;
}
export type TDynaduxReducer<TState, TPayload> = (params: IDynaduxReducerAPI<TState, TPayload>) => undefined | void | Partial<TState>;
export interface IDynaduxReducerAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxReducerDispatch<TPayload>;
    state: TState;
    blockChange: () => void;
}
export interface IDynaduxMiddlewareBeforeAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxMiddlewareDispatch<TPayload>;
    state: TState;
}
export interface IDynaduxMiddlewareAfterAPI<TState, TPayload> {
    action: string;
    payload: any;
    reducerElapsedMs: number;
    dispatch: TDynaduxMiddlewareDispatch<TPayload>;
    state: TState;
    changed: boolean;
    initialState: TState;
}
export type TDynaduxReducerDispatch<TPayload = any> = (action: string, payload?: TPayload, dispatchConfig?: IDispatchConfig) => void;
export type TDynaduxMiddlewareDispatch<TPayload = any> = (action: string, payload?: TPayload) => void;
export interface IDynaduxMiddleware<TState = any, TPayload = any> {
    init?: (store: Dynadux<TState>) => void;
    before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState, TPayload>) => undefined | void | Partial<TState>;
    after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState, TPayload>) => undefined | void | Partial<TState>;
}
interface IDispatchConfig {
    blockChange?: boolean;
    triggerChange?: boolean;
}
export declare class Dynadux<TState = any> {
    private readonly _config;
    private _state;
    private readonly _dispatches;
    private _isDispatching;
    private _reducers;
    constructor(_config?: IDynaduxConfig<TState>);
    get state(): TState;
    setSectionInitialState(section: string, sectionState: any): void;
    addReducers: (reducers: IDynaduxReducerDic<TState>) => void;
    dispatch: <TPayload>(action: string, payload: TPayload, dispatchConfig?: IDispatchConfig) => void;
    _onChange: (_state: TState, _action: string, _payload?: any) => void;
    private _dispatch;
}
export {};
//# sourceMappingURL=Dynadux.d.ts.map