import { IDynaduxMiddleware } from "../Dynadux/Dynadux";
export interface IDynaduxDebugMiddlewareConfig {
    globalVariableName?: string;
}
export interface IDebugLogItem {
    description: string;
    action: string;
    payload: any;
    afterMs: number;
    before: any;
    after: any;
    date: Date;
}
export declare const dynaduxDebugMiddleware: ({ globalVariableName, }?: IDynaduxDebugMiddlewareConfig) => IDynaduxMiddleware<any, any>;
