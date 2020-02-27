export interface IDynaduxConfig<TState> {
    initialState?: TState;
    reducers: {
        [actionName: string]: TDynaduxReducer<TState, any>;
    };
    onChange?: (state: TState) => void;
}
export declare type TDynaduxReducer<TState, TPayload> = (params: TDynaduxReducerAPI<TState, TPayload>) => Partial<TState>;
export interface TDynaduxReducerAPI<TState, TPayload> {
    action: string;
    payload: any;
    dispatch: TDynaduxDispatch<TPayload>;
    state: TState;
}
export declare type TDynaduxDispatch<TPayload = any> = <TPayload>(action: string, payload: TPayload) => void;
export declare class Dynadux<TState> {
    private readonly _config;
    private _state;
    constructor(_config: IDynaduxConfig<TState>);
    getState(): TState;
    dispatch: <TPayload>(action: string, payload: TPayload) => void;
}
