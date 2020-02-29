import { IDynaduxMiddleware } from "../Dynadux/Dynadux";

export enum EUndoRedoActions {
  PREV = 'dynadax___undoRedoMiddleware--PREV',
  NEXT = 'dynadax___undoRedoMiddleware--NEXT',
  SET_RESTORE_POINT = 'dynadax___undoRedoMiddleware--SET_RESTORE_POINT',              // payload: { name: string }
  ACTIVATE_RESTORE_POINT = 'dynadax___undoRedoMiddleware--ACTIVATE_RESTORE_POINT',    // payload: { name: string }
  GET_HISTORY = 'dynadax___undoRedoMiddleware--GET_HISTORY',                          // payload: { stateTargetPropertyName: string }
}

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
  const restorePoints: { [name: string]: number } = {};

  return {
    after: (
      {
        action,
        payload,
        state,
      }
    ) => {
      switch (action) {
        case EUndoRedoActions.PREV:
          if (pointer > 0) return history[--pointer];
          return state;

        case EUndoRedoActions.NEXT:
          if (pointer + 1 < history.length) return history[++pointer];
          return state;

        case EUndoRedoActions.SET_RESTORE_POINT:
          restorePoints[payload.name] = pointer;
          return state;

        case EUndoRedoActions.ACTIVATE_RESTORE_POINT:
          const historyStatePointer = restorePoints[payload.name];
          if (historyStatePointer !== undefined) {
            pointer = historyStatePointer;
            return history[pointer];
          }
          else {
            console.error(`dynadax/undoRedoMiddleware, ACTIVATE_RESTORE_POINT: restore point [${payload.name}] doesn't exist`);
            return state;
          }

        case EUndoRedoActions.GET_HISTORY:
          return {
            ...state,
            [payload.stateTargetPropertyName]: history.concat(),
          };

        default:
          // Push the state
          // If we travel in past
          if (history.length && pointer + 1 < history.length) {
            // then delete the future from this point and continue
            history = history.slice(0, pointer + 1);
            // delete future restore points
            Object.keys(restorePoints)
              .forEach(name => {
                if (restorePoints[name] > pointer) delete restorePoints[name];
              });
          }

          history.push(state);
          pointer++;

          if (historySize > -1 && history.length > historySize) {
            history = history.splice(-historySize);
          }

          return state;
      }
    },
  };
};

