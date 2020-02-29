import { IDynaduxMiddleware } from "../Dynadux/Dynadux";

export const UndoRedoActions = {
  PREV: '___undoRedoMiddleware--PREV',
  NEXT: '___undoRedoMiddleware--NEXT',
  GET_HISTORY: '___undoRedoMiddleware--GET_HISTORY', // payload: { stateTargetPropertyName: string }
};

export interface IUndoRedoMiddlewareConfig {
  historySize?: number; // -1 unlimited
}

export const undoRedoMiddleware = <TState>(
  {
    historySize = -1,
  }: IUndoRedoMiddlewareConfig
    = {}
): IDynaduxMiddleware<TState> => {
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
    // If we travel in past
    if (pointer + 1 < history.length) {
      // then delete the future from this point and continue
      history = history.slice(0, pointer + 1);
    }

    history.push(state);
    pointer++;

    if (historySize > -1 && history.length > historySize) {
      history = history.splice(-historySize);
    }

    return state;
  };

  return {
    after: (
      {
        action,
        payload,
        state,
      }
    ) => {
      switch (action) {
        case UndoRedoActions.PREV:
          return prev(state);

        case UndoRedoActions.NEXT:
          return next(state);

        case UndoRedoActions.GET_HISTORY:
          return {
            ...state,
            [payload.stateTargetPropertyName]: history.concat(),
          };

        default:
          return push(state);
      }
    },
  };
};

