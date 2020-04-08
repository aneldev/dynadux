import {
  Dynadux,
  IDynaduxConfig,
  TDynaduxReducerDispatch,
  IDynaduxReducerDic,
} from "../Dynadux/Dynadux";
import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";

export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}

export interface ICreateStoreAPI<TState = any> {
  state: TState;
  dispatch: TDynaduxReducerDispatch;
  createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;
}

export interface ICreateSectionConfig<TSectionState> {
  section: string;
  initialState: TSectionState;
  reducers: IDynaduxReducerDic<TSectionState>;
  onChange?: (sectionState: TSectionState, action: string, payload?: any) => void;
}

export interface ICreateSectionAPI<TState, TSectionState> {
  storeState: TState;
  state: TSectionState;
  dispatch: TDynaduxReducerDispatch;
}

export const createStore = <TState = any>(config?: ICreateStoreConfig<TState>): ICreateStoreAPI<TState> => {
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
        onChange,
      } = createSectionConfig;
      const sectionActions: string[] = Object.keys(reducers);

      const dynaduxOnChange = dynadux._onChange;
      dynadux._onChange = (state: TState, action: string, payload?: any): void => {
        if (sectionActions.includes(action)) onChange && onChange(state[section], action, payload);
        dynaduxOnChange(state, action, payload);
      };

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

