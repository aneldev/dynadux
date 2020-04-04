import { IDynaduxMiddleware } from "../Dynadux/Dynadux";
export interface IDynaduxDebugMiddlewareConfig {
    debuggerStoreName: string;
    consoleDispatch?: boolean;
    consolePayload?: boolean;
    consoleMethod?: 'log' | 'debug';
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
export declare const dynaduxDebugMiddleware: (config: IDynaduxDebugMiddlewareConfig) => IDynaduxMiddleware<any, any>;
