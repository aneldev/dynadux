export interface IDynaduxConfig<TState> {
    initialState?: TState;
    reducers?: IDynaduxReducerDic<TState> | IDynaduxReducerDic<TState>[];
    middlewares?: IDynaduxMiddleware<any>[];
    onDispatch?: (action: string, payload: any) => void;
    onChange?: (state: TState, action: string, payload?: any) => void;
}
export interface IDynaduxReducerDic<TState> {
    [action: string]: TDynaduxReducer<TState>;
}
export type TDynaduxReducer<TState> = (params: IDynaduxReducerAPI<TState>) => undefined | void | Partial<TState>;
export interface IDynaduxReducerAPI<TState> {
    action: string;
    payload: any;
    dispatch: TDynaduxReducerDispatch;
    state: TState;
    blockChange: () => void;
}
export interface IDynaduxMiddlewareBeforeAPI<TState> {
    action: string;
    payload: any;
    dispatch: TDynaduxMiddlewareDispatch;
    state: TState;
}
export interface IDynaduxMiddlewareAfterAPI<TState> {
    action: string;
    payload: any;
    reducerElapsedMs: number;
    dispatch: TDynaduxMiddlewareDispatch;
    state: TState;
    changed: boolean;
    initialState: TState;
}
export type TDynaduxReducerDispatch = <TPayload>(action: string, payload?: TPayload, dispatchConfig?: IDispatchConfig) => void;
export type TDynaduxMiddlewareDispatch = <TPayload>(action: string, payload?: TPayload) => void;
export interface IDynaduxMiddleware<TState = any> {
    init?: (store: Dynadux<TState>) => void;
    before?: (reducerAPI: IDynaduxMiddlewareBeforeAPI<TState>) => undefined | void | Partial<TState>;
    after?: (reducerAPI: IDynaduxMiddlewareAfterAPI<TState>) => undefined | void | Partial<TState>;
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