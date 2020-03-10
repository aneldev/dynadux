import { IDynaduxMiddleware } from "../Dynadux/Dynadux";
export interface IDynaduxDebugMiddlewareConfig {
    globalVariableName?: string;
}
export interface IDebugLogItem {
    desc: string;
    action: string;
    payload: any;
    afterMs: number;
    before: any;
    after: any;
}
export declare const dynaduxDebugMiddleware: ({ globalVariableName, }?: IDynaduxDebugMiddlewareConfig) => IDynaduxMiddleware<void, void>;
