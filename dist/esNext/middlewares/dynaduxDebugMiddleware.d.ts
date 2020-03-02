import { IDynaduxMiddleware } from "../Dynadux/Dynadux";
export interface IDynaduxDebugMiddlewareConfig {
    globalVariableName?: string;
}
export declare const dynaduxDebugMiddleware: ({ globalVariableName, }?: IDynaduxDebugMiddlewareConfig) => IDynaduxMiddleware<void, void>;
