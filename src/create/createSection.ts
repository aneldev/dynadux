import { Dynadux } from "../Dynadux/Dynadux";
import { convertReducersToSectionReducers } from "./convertReducersToSectionReducers";
import { EventEmitter } from "../tools/EventEmitter";

import {
  ICreateSectionConfig,
  ICreateSectionAPI
} from "./createStore";

export const createSection = <TState, TSectionState>(
  {
    dynadux,
    createSectionConfig,
  }: {
    dynadux: Dynadux<TState>;
    createSectionConfig: ICreateSectionConfig<TSectionState>;
  }
): ICreateSectionAPI<TState, TSectionState> => {
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
};
