import { Dynadux } from "../Dynadux/Dynadux";
import { ICreateSectionConfig, ICreateSectionAPI } from "./createStore";
export declare const createSection: <TState, TSectionState>({ dynadux, createSectionConfig, }: {
    dynadux: Dynadux<TState>;
    createSectionConfig: ICreateSectionConfig<TSectionState>;
}) => ICreateSectionAPI<TState, TSectionState>;
