import "jest";
import {
  createStore
} from "../../src";

interface ITodoAppState {
  logged: boolean;
  todos: ITodo[];
}

interface ITodo {
  id: string;
  label: string;
  done: boolean;
}

describe('Dynadux', () => {
  test('Dispatch methods', () => {
    let stateChanged = 0;

    const createTodoAppStore = (onChange: (state: ITodoAppState) => void) => {
      const dispatchedActions: { action: string, payload: any }[] = [];
      const store = createStore<ITodoAppState>({
        onChange,
        onDispatch: (action, payload) => dispatchedActions.push({action, payload}),
        initialState: {
          logged: false,
          todos: [],
        },
      });

      return {
        get state() {
          return store.state;
        },

        get dispatchedActions() {
          return dispatchedActions;
        },

        login: (logged: boolean): void => store.dispatchMethod('LOGIN', () => {
          return {logged};
        }),

        addTodo: (todo: ITodo): void => store.dispatchMethod('ADD_TODO', ({state: {todos}}) => {
          return {
            todos: todos.concat(todo),
          };
        }),

        removeTodo: (todoId: string): void => store.dispatchMethod('ADD_TODO', ({state: {todos}}) => {
          return {
            todos: todos.filter(todo => todo.id !== todoId),
          };
        }),

      };
    };

    const handleStateChange = (state: ITodoAppState) => {
      stateChanged++;
    };

    const todoAppStore = createTodoAppStore(handleStateChange);

    expect(todoAppStore.state).toMatchSnapshot('Initial state');

    todoAppStore.login(true);
    todoAppStore.addTodo({id: '301', label: 'Before work beers', done: false});
    todoAppStore.addTodo({id: '302', label: 'After work beers', done: false});

    expect(todoAppStore.state).toMatchSnapshot('First todos');

    todoAppStore.removeTodo('302');

    expect(todoAppStore.state).toMatchSnapshot('After remove of 302 todo');

    expect(stateChanged).toBe(4);

    expect(todoAppStore.dispatchedActions).toMatchSnapshot('Dispatched actions');
  });
});
