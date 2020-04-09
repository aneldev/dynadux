import {
  Dynadux,
  IDynaduxConfig,
  TDynaduxReducerDispatch,
  IDynaduxReducerDic,
} from "../Dynadux/Dynadux";
import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";
import { EventEmitter } from "../tools/EventEmitter";

export interface ICreateStoreConfig<TState> extends IDynaduxConfig<TState> {
}

export interface ICreateStoreAPI<TState = any> {
  state: TState;
  dispatch: TDynaduxReducerDispatch;

  createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>) => ICreateSectionAPI<TState, TSectionState>;

  addChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
  removeChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;

  provider: IStoreProviderAPI<TState>;
}

export interface IStoreProviderAPI<TState> {
  addChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
  removeChangeEventListener: (cb: (sectionState: TState, action: string, payload?: any) => void) => void;
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
  addChangeEventListener: (cb: (sectionState: TSectionState, action: string, payload?: any) => void) => void;
  removeChangeEventListener: (cb: (sectionState: TSectionState, action: string, payload?: any) => void) => void;
}

export const createStore = <TState = any>(config?: ICreateStoreConfig<TState>): ICreateStoreAPI<TState> => {
  const dynadux = new Dynadux<TState>(config);
  const storeChangeEventEmitter = new EventEmitter();

  const dynaduxOnChange = dynadux._onChange;
  dynadux._onChange = ((state: TState, action: string, payload?: any) => {
    storeChangeEventEmitter.trigger(state, action, payload);
    dynaduxOnChange(state, action, payload);
  });

  return {
    get state() {
      return dynadux.state;
    },

    dispatch: dynadux.dispatch,

    addChangeEventListener: (cb) => storeChangeEventEmitter.addEventListener(cb),
    removeChangeEventListener: (cb) => storeChangeEventEmitter.removeEventListener(cb),

    provider: {
      addChangeEventListener: (cb) => storeChangeEventEmitter.addEventListener(cb),
      removeChangeEventListener: (cb) => storeChangeEventEmitter.removeEventListener(cb),
    },

    createSection: <TSectionState>(createSectionConfig: ICreateSectionConfig<TSectionState>): ICreateSectionAPI<TState, TSectionState> => {
      const {
        section,
        initialState,
        reducers,
        onChange,
      } = createSectionConfig;
      const sectionActions: string[] = Object.keys(reducers);
      const sectionChangeEventEmitter = new EventEmitter();

      const dynaduxOnChange = dynadux._onChange;
      dynadux._onChange = (state: TState, action: string, payload?: any): void => {
        if (sectionActions.includes(action)) {
          sectionChangeEventEmitter.trigger(state, action, payload);
          onChange && onChange(state[section], action, payload);
        }
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
        addChangeEventListener: (cb) => sectionChangeEventEmitter.addEventListener(cb),
        removeChangeEventListener: (cb) => sectionChangeEventEmitter.removeEventListener(cb),
      };
    }
  };
};

