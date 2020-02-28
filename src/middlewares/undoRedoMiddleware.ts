import { IDynaduxMiddleware } from "../Dynadux/Dynadux";

export const UndoRedoActions = {
  PREV: '___undoRedoMiddleware--PREV',
  NEXT: '___undoRedoMiddleware--NEXT',
};

export const undoRedoMiddleware = <TState>(): IDynaduxMiddleware<TState> => {
  let history: TState[] = [];
  let pointer = -1;

  const prev = (state: TState): TState => {
    if (pointer > 0) return history[--pointer];
    return state;
  };
  const next = (state: TState): TState => {
    if (pointer + 1 < history.length) return history[++pointer];
    return state;
  };

  const push = (state: TState): TState => {
    if (pointer + 1 < history.length) {
      // we travel in past
      history = history.slice(0, pointer + 1);
    }
    history.push(JSON.parse(JSON.stringify(state))); // Todo: remoce the JSON
    pointer++;
    return state;
  };

  return {
    after: (
      {
        action,
        state,
      }
    ) => {
      if (action === UndoRedoActions.PREV) return prev(state);
      if (action === UndoRedoActions.NEXT) return next(state);
      return push(state);
    },
  };
};

