import "jest";

import {
  createStore,
  undoRedoMiddleware,
  UndoRedoActions,
} from "../../src";

interface ITodoAppState {
  todos: ITodo[];
}

interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

const actions = {
  ADD_TODO: 'ADD_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
};

describe('Dynadux', () => {
  test('Undo/Redo middleware', async (done) => {
    const createTodoAppStore = (onChange?: (state: ITodoAppState) => void) => {
      const store = createStore<ITodoAppState>({
        initialState: {
          todos: [],
        },
        middlewares: [
          undoRedoMiddleware(),
        ],
        onChange,
        reducers: {
          [actions.ADD_TODO]: ({state, payload}) => {
            return {
              ...state,
              todos: state.todos.concat(payload),
            };
          },
          [actions.REMOVE_TODO]: ({state, payload: todoId}) => {
            return {
              ...state,
              todos: state.todos.filter(todo => todo.id !== todoId),
            };
          },
        },
      });

      return {
        get state() {
          return store.state;
        },
        addTodo: (todo: ITodo) => store.dispatch<ITodo>(actions.ADD_TODO, todo),
        removeTodo: (todoId: string) => store.dispatch<string>(actions.REMOVE_TODO, todoId),
        history: {
          prev: () => store.dispatch(UndoRedoActions.PREV),
          next: () => store.dispatch(UndoRedoActions.NEXT),
        },
      };
    };

    const appStore = createTodoAppStore();
    const getTodoIds = () => appStore.state.todos.map(todo => todo.id).join();

    appStore.addTodo({id: '301', label: 'Before work beers', done: false});
    appStore.addTodo({id: '302', label: 'After work beers', done: false});
    expect(getTodoIds()).toBe('301,302');

    appStore.addTodo({id: '303', label: 'Evening beers', done: false});
    expect(getTodoIds()).toBe('301,302,303');

    appStore.history.prev();
    expect(getTodoIds()).toBe('301,302');

    appStore.history.next();
    expect(getTodoIds()).toBe('301,302,303');

    appStore.history.prev();
    appStore.history.prev();
    expect(getTodoIds()).toBe('301');

    appStore.history.prev();
    expect(getTodoIds()).toBe('301'); // We reached the first history item

    appStore.history.next();
    appStore.history.next();
    expect(getTodoIds()).toBe('301,302,303');

    appStore.history.next();
    expect(getTodoIds()).toBe('301,302,303'); // We reached the last history item, this is the current

    appStore.history.prev();
    appStore.addTodo({id: '304', label: 'Sleep', done: false});
    expect(getTodoIds()).toBe('301,302,304'); // 303 is deleted because the 304 is pushed when we were back in time

    appStore.history.next();
    expect(getTodoIds()).toBe('301,302,304'); // We reached the last history item, this is the current

    done();
  });
});
