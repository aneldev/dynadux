import {
  Dynadux,
  IDynaduxConfig,
  TDynaduxDispatch,
  IDynaduxReducerDic,
} from "../Dynadux/Dynadux";
import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";

export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}

export interface ICreateStoreAPI<TState = any> {
  state: TState;
  dispatch: TDynaduxDispatch;
  createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;
}

export interface ICreateSectionConfig<TSectionState> {
  section: string;
  initialState: TSectionState;
  reducers: IDynaduxReducerDic<TSectionState>;
}

export interface ICreateSectionAPI<TState, TSectionState> {
  storeState: TState;
  state: TSectionState;
  dispatch: TDynaduxDispatch;
}

export const createStore = <TState = any>(config: ICreateStoreConfig<TState>): ICreateStoreAPI<TState> => {
  const dynadux = new Dynadux<TState>(config);

  return {
    get state() {
      return dynadux.state;
    },
    dispatch: dynadux.dispatch,
    createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>): ICreateSectionAPI<TState, TSectionState> => {
      const {
        section,
        initialState,
        reducers,
      } = createSectionConfig;

      if (dynadux.state[section]) throw new Error(`dynadux: createSection: Section or root property "${section}" already exists, section couldn't be created.`);

      dynadux.setSectionInitialState(section, initialState);
      dynadux.addReducers(convertReducersToSectionReducers(section, reducers));

      return {
        get storeState(): TState {
          return dynadux.state;
        },
        get state(): TSectionState {
          return dynadux.state[section];
        },
        dispatch: dynadux.dispatch,
      };
    }
  };
};

