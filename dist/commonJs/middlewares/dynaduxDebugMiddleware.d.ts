import { IDynaduxMiddleware } from "../Dynadux/Dynadux";
export interface IDynaduxDebugMiddlewareConfig {
    debuggerStoreName: string;
    consoleDispatch?: boolean;
    consolePayload?: boolean;
    consoleState?: boolean;
    consoleMethod?: 'log' | 'debug';
    consoleFilter?: (action: string, payload: any) => boolean;
}
export interface IDebugLogItem {
    description: string;
    action: string;
    payload: any;
    afterMs?: number;
    before: any;
    after: any;
    date: Date;
    changed: boolean;
}
export declare const dynaduxDebugMiddleware: (config: IDynaduxDebugMiddlewareConfig) => IDynaduxMiddleware<any, any>;
